const express = require('express');
const router = express.Router();
const { subscribe, sendNotification } = require('../controllers/pushController');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   POST /api/push/subscribe
// @desc    Subscribe a user to push notifications
// @access  Private
router.post('/subscribe', protect, subscribe);

// @route   POST /api/push/send
// @desc    Send a push notification to all subscribers
// @access  Private/Admin
router.post('/send', protect, admin, sendNotification);

module.exports = router;