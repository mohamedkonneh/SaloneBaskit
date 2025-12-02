import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const ConversationList = ({ conversations, selectedConversationId, onSelectConversation, loading }) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Chats</h2>
      {loading ? <p style={{padding: '20px'}}>Loading...</p> : (
        <div>
          {conversations.map(conv => (
            <div
              key={conv.id}
              style={{...styles.item, ...(selectedConversationId === conv.id ? styles.selectedItem : {})}}
              onClick={() => onSelectConversation(conv)}
            >
              <FaUserCircle size={40} style={styles.avatar} />
              <div style={styles.details}>
                {/* If conv.user_name exists, it's an admin viewing the list. Otherwise, it's a user. */}
                <p style={styles.name}>{conv.user_name || conv.supplier_name || 'Unknown'}</p>
                {/* In a real app, you'd show the last message here */}
                <p style={styles.lastMessage}>Click to view conversation</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    height: '100%',
  },
  header: {
    padding: '20px',
    margin: 0,
    borderBottom: '1px solid #e5e5e5',
    fontSize: '1.5rem',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 20px',
    cursor: 'pointer',
    borderBottom: '1px solid #f0f0f0',
  },
  selectedItem: {
    backgroundColor: '#f0f8ff',
  },
  avatar: {
    color: '#ccc',
    marginRight: '15px',
  },
  details: {},
  name: {
    margin: 0,
    fontWeight: 'bold',
  },
  lastMessage: {
    margin: '4px 0 0 0',
    fontSize: '0.9rem',
    color: '#666',
  },
};

export default ConversationList;