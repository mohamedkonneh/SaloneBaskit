import React from 'react';
import { FaTimes, FaStar } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

import { getImageUrl } from '../pages/imageUrl';

const PLACEHOLDER_IMAGE = 'https://placehold.co/400x400/e9ecef/6c757d?text=No+Image';

const QuickViewModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  if (!product) return null;

  const mainImage = product.image_urls && product.image_urls.length > 0 ? getImageUrl(product.image_urls[0]) : PLACEHOLDER_IMAGE;
  const hasDiscount = product.discounted_price && product.discounted_price < product.price;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={styles.closeButton}><FaTimes /></button>
        <div style={styles.grid}>
          <div style={styles.imageColumn}>
            <img src={mainImage} alt={product.name} style={styles.mainImage} />
            {/* Future enhancement: Add thumbnail gallery here */}
          </div>
          <div style={styles.detailsColumn}>
            <h2 style={styles.title}>{product.name}</h2>
            <div style={styles.ratingContainer}>
              <FaStar color="#ffc107" />
              <span style={styles.ratingText}>{Number(product.rating || 0).toFixed(1)}</span>
              <span style={styles.reviewsText}>({product.num_reviews || 0} reviews)</span>
            </div>
            <p style={styles.description}>{product.description || 'No description available.'}</p>
            
            <div style={styles.priceContainer}>
              {hasDiscount ? (
                <>
                  <p style={styles.discountedPrice}>${Number(product.discounted_price).toFixed(2)}</p>
                  <p style={styles.originalPrice}>${Number(product.price).toFixed(2)}</p>
                </>
              ) : (
                <p style={styles.price}>${Number(product.price).toFixed(2)}</p>
              )}
            </div>

            {/* Future enhancement: Add color/size selectors here */}

            <button onClick={() => addToCart(product, 1)} style={styles.addToCartButton}>Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1300 },
  modal: { backgroundColor: 'white', borderRadius: '8px', width: '90%', maxWidth: '900px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' },
  closeButton: { position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', zIndex: 10 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100%' },
  imageColumn: { backgroundColor: '#f4f6f9', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  mainImage: { maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' },
  detailsColumn: { padding: '40px', overflowY: 'auto' },
  title: { fontSize: '2rem', fontWeight: 'bold', margin: '0 0 10px 0' },
  ratingContainer: { display: 'flex', alignItems: 'center', color: '#6c757d', fontSize: '1rem', marginBottom: '20px' },
  ratingText: { marginLeft: '5px', fontWeight: 'bold' },
  reviewsText: { marginLeft: '5px' },
  description: { fontSize: '1rem', lineHeight: '1.6', color: '#555', marginBottom: '20px' },
  priceContainer: { display: 'flex', alignItems: 'baseline', gap: '15px', marginBottom: '30px' },
  price: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#007bff',
    margin: 0,
  },
  discountedPrice: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#dc3545',
    margin: 0,
  },
  originalPrice: {
    fontSize: '1.2rem',
    color: '#6c757d',
    textDecoration: 'line-through',
    margin: 0,
  },
  addToCartButton: {
    width: '100%',
    padding: '15px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default QuickViewModal;