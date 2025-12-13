import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axiosConfig';

const ReplyModal = ({ message, onClose, onReplySent }) => {
  const [replyBody, setReplyBody] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!message.user_id) {
      toast.error("Cannot reply: This message is not linked to a registered user.");
      return;
    }
    setLoading(true);
    try {
      const submissionData = {
        recipient_id: message.user_id, // Send the user's ID
        subject: `Re: ${message.subject || 'Your inquiry on SaloneBaskit'}`, // Use original subject if available
        body: replyBody,
        original_message_id: message.id, // Link to the original message
      };
      // We will create this new endpoint on the backend
      await api.post('/contact/reply-internal', submissionData);
      toast.success('Reply sent to user mailbox!');
      if (onReplySent) {
        onReplySent(message.id); // Signal success with the ID of the replied message
      }
      onClose(); // Close the modal
    } catch (error) {
      toast.error('Failed to send reply.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Reply to {message.name}</h2>
        <p style={styles.originalMessage}><strong>Original Message:</strong> "{message.message}"</p>
        <form onSubmit={handleSendReply}>
          <textarea
            style={styles.textarea}
            rows="8"
            placeholder="Type your reply here..."
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            required
          />
          <div style={styles.buttonGroup}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>Cancel</button>
            <button type="submit" style={styles.sendButton} disabled={loading}>
              {loading ? 'Sending...' : 'Send Reply'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 },
  modal: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '600px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' },
  title: { marginTop: 0, marginBottom: '15px' },
  originalMessage: { fontStyle: 'italic', color: '#555', borderLeft: '3px solid #eee', paddingLeft: '10px', marginBottom: '20px' },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    boxSizing: 'border-box',
    marginBottom: '20px',
  },
  buttonGroup: { display: 'flex', justifyContent: 'flex-end', gap: '10px' },
  cancelButton: {
    padding: '10px 20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    background: '#f0f0f0',
    cursor: 'pointer',
  },
  sendButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    background: '#007bff',
    color: 'white',
    cursor: 'pointer',
  },
};

export default ReplyModal;