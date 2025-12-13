import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

const CollectionsSideModal = ({ isOpen, onClose, collections }) => {
  // Placeholder images for collections. In a real app, these would come from the category data.
  const placeholderImages = [
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1780&auto=format&fit=crop',
  ];

  return (
    <>
      <div style={{ ...styles.overlay, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }} onClick={onClose}></div>
      <div style={{ ...styles.modal, transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        <div style={styles.header}>
          <h2 style={styles.title}>Our Collections</h2>
          <button onClick={onClose} style={styles.closeButton}><FaTimes /></button>
        </div>
        <div style={styles.content}>
          {collections.map((collection, index) => (
            <Link to={`/category/${collection.name}`} key={collection.id} style={styles.collectionLink} onClick={onClose}>
              <div style={styles.collectionCard}>
                <img src={placeholderImages[index % placeholderImages.length]} alt={collection.name} style={styles.collectionImage} />
                <div style={styles.collectionOverlay}>
                  <h3 style={styles.collectionName}>{collection.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1300,
    transition: 'opacity 0.3s ease-in-out',
  },
  modal: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '100%',
    maxWidth: '400px',
    height: '100%',
    backgroundColor: 'white',
    boxShadow: '-5px 0 25px rgba(0,0,0,0.2)',
    zIndex: 1301,
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease-in-out',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 25px',
    borderBottom: '1px solid #eee',
  },
  title: { margin: 0, fontSize: '0.9rem' },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '25px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  collectionLink: { textDecoration: 'none' },
  collectionCard: {
    position: 'relative',
    height: '120px',
    borderRadius: '12px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  collectionImage: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' },
  collectionOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  collectionName: {
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
  },
};

export default CollectionsSideModal;