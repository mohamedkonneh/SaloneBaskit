const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, getUserProfile, updateUserProfile, deleteUser, getUserMailbox } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
// @route   POST /api/users/register
// @desc    Register a new user
router.post('/register', registerUser);

// @route   POST /api/users/login
// @desc    Authenticate user & get token
router.post('/login', loginUser);

// @route   GET, PUT /api/users/profile
// @desc    Get or Update user profile
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// @route   GET /api/users
// @desc    Get all users
router.get('/', protect, admin, getUsers);

// @route   DELETE /api/users/:id
// @desc    Delete a user
router.delete('/:id', protect, admin, deleteUser);

// Route for user to get their messages
router.get('/mailbox', protect, getUserMailbox);

module.exports = router;