const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    // 2. Check if user already exists
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Determine if the user should be an admin by checking against an environment variable.
    const isAdmin = email === process.env.ADMIN_EMAIL;

    // 4. Insert new user into the database, now including the is_admin status
    const newUserQuery = 'INSERT INTO users (username, email, password_hash, is_admin) VALUES ($1, $2, $3, $4) RETURNING id, username, email, is_admin, photo_url';
    const newUser = await db.query(newUserQuery, [name, email, password_hash, isAdmin]);

    const user = newUser.rows[0];

    // 5. Respond with user data and a token. The 'if/else' is not needed here.
    // If the insert failed, the catch block would have handled it.
    return res.status(201).json({
      id: user.id,
      name: user.username, // Return username as 'name' to match frontend expectations
      email: user.email,
      isAdmin: user.is_admin,
      photoUrl: user.photo_url, // Will be null for new users, which is correct
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error during user registration.' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const userQuery = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userQuery.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = userQuery.rows[0];

    // 2. Check if password matches
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3. Respond with user data and a token
    res.json({
      id: user.id,
      name: user.username, // Return username as 'name'
      email: user.email,
      isAdmin: user.is_admin,
      photoUrl: user.photo_url, // Include photoUrl on login
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  // req.user is attached by the 'protect' middleware
  res.json({
    id: req.user.id,
    name: req.user.username, // Return username as 'name'
    email: req.user.email,
    isAdmin: req.user.is_admin,
    photoUrl: req.user.photo_url, // Add the photoUrl to the response
  });
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    // The 'protect' middleware already provides req.user, so we don't need to query again.
    const user = req.user;

    // Use the new name from the body, or keep the existing name from req.user
    const updatedName = req.body.name || user.username;

    const updateQuery = 'UPDATE users SET username = $1 WHERE id = $2 RETURNING id, username, email, is_admin, photo_url';
    const updatedUserResult = await db.query(updateQuery, [updatedName, user.id]);
    const updatedUser = updatedUserResult.rows[0];

    res.json({
      id: updatedUser.id,
      name: updatedUser.username, // Return username as 'name'
      email: updatedUser.email,
      isAdmin: updatedUser.is_admin,
      photoUrl: updatedUser.photo_url, // Ensure photoUrl is returned on profile update
      // Note: A new token is only needed if the payload (e.g., user ID, roles) changes.
      token: generateToken(updatedUser.id),
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error on profile update.' });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await db.query('SELECT id, username AS name, email, is_admin FROM users ORDER BY id ASC');
    res.json(users.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error fetching users.' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    // Check if the user to be deleted exists first for a better response.
    const userExists = await db.query('SELECT id FROM users WHERE id = $1', [req.params.id]);

    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    await db.query('DELETE FROM users WHERE id = $1', [req.params.id]); res.json({ message: 'User removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error deleting user.' });
  }
};

// @desc    Get replies for the logged-in user
// @route   GET /api/users/mailbox
// @access  Private
const getUserMailbox = async (req, res) => {
  try {
    const replies = await db.query(
      'SELECT id, subject, message, created_at, is_read FROM admin_replies WHERE recipient_email = $1 ORDER BY created_at DESC',
      [req.user.email]
    );
    res.json(replies.rows);
  } catch (error) {
    console.error('Error fetching user mailbox:', error);
    res.status(500).json({ message: 'Server Error fetching mailbox.' });
  }
};

const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }

    // Upload image to Cloudinary using a stream
    const uploadStream = cloudinary.uploader.upload_stream({
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      folder: 'profile_photos', // Optional: organize uploads in Cloudinary
    }, async (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ message: 'Failed to upload image.' });
      }

      const photoUrl = result.secure_url;

      const updateQuery = 'UPDATE users SET photo_url = $1 WHERE id = $2 RETURNING id, username, email, is_admin, photo_url';
      const updatedUserResult = await db.query(updateQuery, [photoUrl, req.user.id]);
      const updatedUser = updatedUserResult.rows[0];

      res.json({
        id: updatedUser.id,
        name: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.is_admin,
        photoUrl: updatedUser.photo_url,
        token: generateToken(updatedUser.id),
      });
    });

    // Pipe the file buffer from memory into the upload stream
    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    res.status(500).json({ message: 'Server error during photo upload.' });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile, getUsers, deleteUser, getUserMailbox, uploadProfilePhoto };
