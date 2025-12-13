import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmButtonColor = '#dc3545' }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.message}>{message}</p>
        <div style={styles.buttonGroup}>
          <button onClick={onClose} style={{ ...styles.button, ...styles.cancelButton }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ ...styles.button, ...styles.confirmButton, backgroundColor: confirmButtonColor }}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1200,
  },
  modal: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    marginTop: 0,
    color: '#333',
  },
  message: {
    color: '#555',
    marginBottom: '25px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    color: 'white',
  },
  confirmButton: {
    backgroundColor: '#dc3545',
    color: 'white',
  },
};

export default ConfirmationModal;