const db = require('../config/db');
const { getIo } = require('../socket'); // Corrected path: should be require('../socket')

// @desc    Get or create a conversation between a user and a supplier
// @route   POST /api/chat/conversations
// @access  Private
const getOrCreateConversation = async (req, res) => {
  const userId = req.user.id;
  const { supplierId } = req.body;

  if (!supplierId) {
    return res.status(400).json({ message: 'Supplier ID is required' });
  }

  try {
    // Check if a conversation already exists
    let conversation = await db.query(
      'SELECT * FROM conversations WHERE user_id = $1 AND supplier_id = $2',
      [userId, supplierId]
    );

    if (conversation.rows.length > 0) {
      // Conversation exists, return it
      res.json(conversation.rows[0]);
    } else {
      // Conversation does not exist, create it
      const newConversation = await db.query(
        'INSERT INTO conversations (user_id, supplier_id) VALUES ($1, $2) RETURNING *',
        [userId, supplierId]
      );
      res.status(201).json(newConversation.rows[0]);
    }
  } catch (error) {
    console.error('Error in getOrCreateConversation:', error);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all conversations for the logged-in user or all conversations for an admin
// @route   GET /api/chat/conversations
// @access  Private
const getUserConversations = async (req, res) => {
  try {
    let conversations;
    if (req.user.is_admin) {
      // Admin gets all conversations with user and supplier names
      const query = `
        SELECT c.id, c.user_id, c.supplier_id, u.name as user_name, s.name as supplier_name, c.created_at 
        FROM conversations c
        JOIN users u ON c.user_id = u.id
        JOIN suppliers s ON c.supplier_id = s.id
        ORDER BY c.created_at DESC
      `;
      conversations = await db.query(query);
    } else {
      // Regular user gets only their conversations
      const query = `
        SELECT c.id, c.user_id, c.supplier_id, s.name as supplier_name, c.created_at 
        FROM conversations c
        JOIN suppliers s ON c.supplier_id = s.id
        WHERE c.user_id = $1 
        ORDER BY c.created_at DESC
      `;
      conversations = await db.query(query, [req.user.id]);
    }
    res.json(conversations.rows);
  } catch (error) {
    console.error('Error fetching user conversations:', error);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all messages for a conversation
// @route   GET /api/chat/conversations/:id/messages
// @access  Private
const getMessages = async (req, res) => {
  try {
    const messages = await db.query(
      'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
      [req.params.id]
    );
    res.json(messages.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).send('Server Error');
  }
};

// @desc    Send a message in a conversation
// @route   POST /api/chat/conversations/:id/messages
// @access  Private
const sendMessage = async (req, res) => {
  const { body } = req.body;
  const conversationId = req.params.id;
  const senderId = req.user.id;

  try {
    const newMessage = await db.query(
      'INSERT INTO messages (conversation_id, sender_id, body) VALUES ($1, $2, $3) RETURNING *',
      [conversationId, senderId, body] // This was correct, but ensuring it's clear.
    );

    // Emit the message via Socket.IO to other clients in the room
    getIo().to(String(conversationId)).emit('newMessage', newMessage.rows[0]);

    res.status(201).json(newMessage.rows[0]);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a single message
// @route   DELETE /api/chat/messages/:id
// @access  Private
const deleteMessage = async (req, res) => {
  // In a real app, you'd also check if req.user.id is the sender_id
  try {
    await db.query('DELETE FROM messages WHERE id = $1', [req.params.id]);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

// @desc    Delete all messages in a conversation
// @route   DELETE /api/chat/conversations/:id/messages
// @access  Private
const clearConversationMessages = async (req, res) => {
  try {
    await db.query('DELETE FROM messages WHERE conversation_id = $1', [req.params.id]);
    res.json({ message: 'All messages cleared from conversation' });
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a conversation and its messages
// @route   DELETE /api/chat/conversations/:id
// @access  Private
const deleteConversation = async (req, res) => {
  try {
    await db.query('DELETE FROM messages WHERE conversation_id = $1', [req.params.id]);
    await db.query('DELETE FROM conversations WHERE id = $1', [req.params.id]);
    res.json({ message: 'Conversation deleted' });
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

module.exports = { getOrCreateConversation, getUserConversations, getMessages, sendMessage, deleteMessage, clearConversationMessages, deleteConversation };