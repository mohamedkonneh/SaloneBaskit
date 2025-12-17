const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, getUserProfile, updateUserProfile, deleteUser, getUserMailbox, uploadProfilePhoto } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateRegistration, validateLogin, validateProfileUpdate } = require('../middleware/validationMiddleware');
const { upload } = require('../middleware/uploadMiddleware'); // This is the multer instance

// A wrapper middleware to handle multer errors gracefully
const handleUpload = (req, res, next) => {
  upload.single('photo')(req, res, function (err) {
    if (err) {
      // This catches errors from multer (e.g., file size) and our custom file filter
      // The errorHandler in errorMiddleware.js is already set up to format these.
      return next(err);
    }
    // If no error, proceed to the next middleware/controller
    next();
  });
};


// @route   POST /api/users/register
// @desc    Register a new user
router.post('/register', validateRegistration, registerUser);

// @route   POST /api/users/login
// @desc    Authenticate user & get token
router.post('/login', validateLogin, loginUser);

// @route   GET, PUT /api/users/profile
// @desc    Get or Update user profile
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, validateProfileUpdate, updateUserProfile);

// @route   GET /api/users
// @desc    Get all users
router.get('/', protect, admin, getUsers);

// @route   DELETE /api/users/:id
// @desc    Delete a user
router.delete('/:id', protect, admin, deleteUser);

// Route for user to get their messages
router.get('/mailbox', protect, getUserMailbox);

// @route   POST /api/users/profile/photo
router.post('/profile/photo', protect, handleUpload, uploadProfilePhoto);

module.exports = router;