const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

    // 4. Insert new user into the database
    const newUserQuery = 'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, is_admin';
    const newUser = await db.query(newUserQuery, [name, email, password_hash]);

    const user = newUser.rows[0];

    // 5. Respond with user data and a token
    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
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
      name: user.name,
      email: user.email,
      isAdmin: user.is_admin,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  // req.user is attached by the 'protect' middleware
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    isAdmin: req.user.is_admin,
  });
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const userQuery = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = userQuery.rows[0];

    if (user) {
      const updatedName = name || user.name;

      const updateQuery = 'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, email, is_admin';
      const updatedUserResult = await db.query(updateQuery, [updatedName, req.user.id]);
      const updatedUser = updatedUserResult.rows[0];

      res.json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.is_admin,
        token: generateToken(updatedUser.id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await db.query('SELECT id, name, email, is_admin FROM users ORDER BY id ASC');
    res.json(users.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'User removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get replies for the logged-in user
// @route   GET /api/users/mailbox
// @access  Private
const getUserMailbox = async (req, res) => {
  try {
    const replies = await db.query(
      'SELECT * FROM admin_replies WHERE recipient_email = $1 ORDER BY created_at DESC',
      [req.user.email]
    );
    res.json(replies.rows);
  } catch (error) {
    console.error('Error fetching user mailbox:', error);
    res.status(500).send('Server Error');
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile, getUsers, deleteUser, getUserMailbox };
