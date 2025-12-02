const express = require('express');
const router = express.Router();
const { getOrCreateConversation, getUserConversations, getMessages, sendMessage, deleteMessage, clearConversationMessages, deleteConversation } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.route('/conversations')
    .post(protect, getOrCreateConversation)
    .get(protect, getUserConversations);

router.route('/conversations/:id').delete(protect, deleteConversation);

router.route('/conversations/:id/messages')
    .get(protect, getMessages)
    .post(protect, sendMessage)
    .delete(protect, clearConversationMessages); // Route to clear all messages

// Route to delete a single message
router.delete('/messages/:id', protect, deleteMessage);

module.exports = router;