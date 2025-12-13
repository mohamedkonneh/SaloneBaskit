const express = require('express');
const router = express.Router();
const { submitContactForm, getContactMessages, replyToMessage } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(submitContactForm)
    .get(protect, admin, getContactMessages);

router.route('/reply')
    .post(protect, admin, replyToMessage);

module.exports = router;