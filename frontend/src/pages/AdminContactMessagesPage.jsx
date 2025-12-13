import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; // Import the configured Axios instance
import { useAuth } from '../hooks/useAuth';
import { FaEnvelope, FaUser, FaPhone, FaCalendarAlt } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa';
import ReplyModal from '../components/ReplyModal';
import WhatsAppReplyModal from '../components/WhatsAppReplyModal';

const AdminContactMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [whatsAppMessage, setWhatsAppMessage] = useState(null);
  const { userInfo, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Use the 'api' instance; the token is added automatically by the interceptor.
        const { data } = await api.get('/contact');
        setMessages(data);
      } catch (err) {
        setError('Could not fetch messages.');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && userInfo?.isAdmin) {
      fetchMessages();
    } else if (!authLoading) {
      setLoading(false);
      setError("You are not authorized to view this page.");
    }
  }, [userInfo, authLoading]);

  const handleReplySent = (messageId) => {
    // Update the state locally to show the "replied" status immediately
    setMessages(currentMessages =>
      currentMessages.map(msg =>
        msg.id === messageId ? { ...msg, replied: true } : msg
      )
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Contact Form Submissions</h1>
      {loading ? <p>Loading messages...</p> : error ? <p style={{color: 'red'}}>{error}</p> : (
        <div style={styles.messagesGrid}>
          {whatsAppMessage && <WhatsAppReplyModal message={whatsAppMessage} onClose={() => setWhatsAppMessage(null)} />}
          {selectedMessage && <ReplyModal message={selectedMessage} onClose={() => setSelectedMessage(null)} onReplySent={handleReplySent} />}
          {messages.length === 0 ? (
            <p>No messages have been submitted yet.</p>
          ) : (
            messages.map(msg => (
              <div key={msg.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.userInfo}>
                    <FaUser style={styles.icon} /> <strong>{msg.name}</strong>
                  </div>
                  <div style={styles.dateInfo}>
                    <FaCalendarAlt style={styles.icon} /> {new Date(msg.created_at).toLocaleString()}
                  </div>
                  <div>
                    {msg.replied && <span style={styles.repliedBadge}>Replied</span>}
                  </div>
                </div>
                <div style={styles.contactInfo}>
                  <span><FaEnvelope style={styles.icon} /> {msg.email}</span>
                  <span><FaPhone style={styles.icon} /> {msg.phone}</span>
                </div>
                <p style={styles.messageText}>{msg.message}</p>
                <div style={styles.cardFooter}>
                  <button 
                    onClick={() => setSelectedMessage(msg)} 
                    style={{...styles.replyButton, ...(!msg.user_id ? styles.disabledButton : {})}}
                    disabled={!msg.user_id}
                    title={!msg.user_id ? "Cannot reply via mailbox: User is not registered." : "Reply to this user"}
                  >
                    Reply via Mailbox
                  </button>
                  {msg.phone && (
                    <button onClick={() => setWhatsAppMessage(msg)} style={styles.whatsappButton}>
                      <FaWhatsapp style={{ marginRight: '5px' }} />
                      Reply via WhatsApp
                    </button>
                  )}
                  {!msg.user_id && <a href={`mailto:${msg.email}`} style={styles.replyViaEmail}>Reply via Email</a>}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { fontFamily: 'system-ui, sans-serif' },
  header: { marginBottom: '30px' },
  messagesGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    padding: '20px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    marginBottom: '15px',
  },
  userInfo: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' },
  dateInfo: { fontSize: '0.9rem', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' },
  contactInfo: {
    display: 'flex',
    gap: '20px',
    color: '#007bff',
    marginBottom: '15px',
    fontSize: '0.9rem',
  },
  messageText: {
    whiteSpace: 'pre-wrap',
    lineHeight: '1.6',
    color: '#333',
  },
  icon: { marginRight: '5px' },
  cardFooter: {
    marginTop: '20px',
    textAlign: 'right',
  },
  replyButton: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
  replyViaEmail: {
    marginLeft: '10px',
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: '#6c757d',
    color: 'white',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 'normal',
  },
  whatsappButton: {
    marginLeft: '10px',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#25D366',
    color: 'white',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
  },
  repliedBadge: {
    backgroundColor: '#e2f5e9',
    color: '#28a745',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
};

export default AdminContactMessagesPage;