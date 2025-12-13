const db = require('../config/db');
const { getIo } = require('../socket'); // Import socket.io instance getter

// @desc    Submit a contact form message
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ message: 'Please fill out all fields.' });
  }

  try {
    const query = `
      INSERT INTO contact_messages (name, email, phone, message)
      VALUES ($1, $2, $3, $4)
    `;
    await db.query(query, [name, email, phone, message]);
    res.status(200).json({ message: 'Thank you for your message! We will get back to you soon.' });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all contact form messages
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = async (req, res) => {
  try {
    const messages = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(messages.rows);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).send('Server Error');
  }
};

// @desc    Admin replies to a contact message
// @route   POST /api/contact/reply
// @access  Private/Admin
const replyToMessage = async (req, res) => {
  const { recipient_email, subject, body } = req.body;
  const admin_id = req.user.id;

  if (!recipient_email || !body) {
    return res.status(400).json({ message: 'Recipient email and message body are required.' });
  }

  try {
    // In a real app, you might also send an email here.
    // For now, we save to the DB and can notify admins via WebSocket.
    const query = `
      INSERT INTO admin_replies (recipient_email, admin_id, subject, body)
      VALUES ($1, $2, $3, $4) RETURNING *
    `;
    const newReply = await db.query(query, [recipient_email, admin_id, subject || 'Response to your inquiry', body]);
    
    // Optional: Notify the user in real-time if they are online
    // getIo().to(recipient_email).emit('new_reply', newReply.rows[0]);

    res.status(201).json(newReply.rows[0]);
  } catch (error) {
    console.error('Error sending reply:', error);
    res.status(500).send('Server Error');
  }
};

module.exports = { submitContactForm, getContactMessages, replyToMessage };