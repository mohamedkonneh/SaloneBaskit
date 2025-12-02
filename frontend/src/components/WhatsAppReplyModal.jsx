import React, { useState } from 'react';

const WhatsAppReplyModal = ({ message, onClose }) => {
  const [replyBody, setReplyBody] = useState('');

  const handleSendWhatsApp = (e) => {
    e.preventDefault();
    
    // Clean the phone number: remove any non-digit characters like +, -, or spaces.
    const phoneNumber = message.phone.replace(/\D/g, '');
    
    const encodedMessage = encodeURIComponent(replyBody);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open the WhatsApp link in a new tab
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Reply to {message.name} via WhatsApp</h2>
        <p style={styles.originalMessage}><strong>Original Message:</strong> "{message.message}"</p>
        <form onSubmit={handleSendWhatsApp}>
          <textarea
            style={styles.textarea}
            rows="8"
            placeholder="Type your WhatsApp reply here..."
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            required
          />
          <div style={styles.buttonGroup}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>Cancel</button>
            <button type="submit" style={styles.sendButton}>
              Open WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusing styles from ReplyModal for consistency
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
  cancelButton: { padding: '10px 20px', border: '1px solid #ccc', borderRadius: '8px', background: '#f0f0f0', cursor: 'pointer' },
  sendButton: { padding: '10px 20px', border: 'none', borderRadius: '8px', background: '#25D366', color: 'white', cursor: 'pointer' },
};

export default WhatsAppReplyModal;