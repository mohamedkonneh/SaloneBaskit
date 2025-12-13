import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; // Import the configured Axios instance
import { useAuth } from '../hooks/useAuth';
import { FaEnvelopeOpen, FaStore } from 'react-icons/fa';

const MailboxPage = () => {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openReplyId, setOpenReplyId] = useState(null);
  const { userInfo, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        // Use the 'api' instance; the token is added automatically by the interceptor.
        const { data } = await api.get('/users/mailbox');
        setReplies(data);
      } catch (err) {
        setError('Could not fetch your messages.');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && userInfo) {
      fetchReplies();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [userInfo, authLoading]);

  const toggleReply = (id) => {
    setOpenReplyId(openReplyId === id ? null : id);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>My Mailbox</h2>
      {loading ? <p>Loading messages...</p> : error ? <p style={{color: 'red'}}>{error}</p> : (
        <div style={styles.container}>
          {replies.length === 0 ? (
            <p>You have no messages in your mailbox.</p>
          ) : (
            replies.map(reply => (
              <div key={reply.id} style={styles.letter}>
                <div style={styles.letterHeader} onClick={() => toggleReply(reply.id)}>
                  <div style={styles.headerInfo}>
                    <FaEnvelopeOpen style={{ marginRight: '10px', color: '#007bff' }} />
                    <strong>{reply.subject}</strong>
                  </div>
                  <span style={styles.date}>{new Date(reply.created_at).toLocaleDateString()}</span>
                </div>
                {openReplyId === reply.id && (
                  <div style={styles.letterBody}>
                    <div style={styles.companyHeader}>
                      <FaStore style={{ fontSize: '2rem', color: '#007bff' }} />
                      <div>
                        <h3 style={{ margin: 0 }}>SaloneBaskit</h3>
                        <p style={{ margin: 0, color: '#666' }}>Customer Support</p>
                      </div>
                    </div>
                    <p style={styles.bodyText}>{reply.body}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '15px' },
  letter: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    overflow: 'hidden',
  },
  letterHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    cursor: 'pointer',
    borderBottom: '1px solid #f0f0f0',
  },
  headerInfo: { display: 'flex', alignItems: 'center' },
  date: { fontSize: '0.9rem', color: '#888' },
  letterBody: {
    padding: '20px',
    borderTop: '1px solid #f0f0f0',
  },
  companyHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    paddingBottom: '15px',
    marginBottom: '15px',
    borderBottom: '1px solid #eee',
  },
  bodyText: {
    whiteSpace: 'pre-wrap',
    lineHeight: '1.7',
    color: '#333',
  },
};

export default MailboxPage;