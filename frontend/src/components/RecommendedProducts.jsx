import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../pages/imageUrl';

const PLACEHOLDER_IMAGE = 'https://placehold.co/250x250/e9ecef/6c757d?text=...';

const RecommendedProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const mainImage = product.image_urls && product.image_urls.length > 0 ? getImageUrl(product.image_urls[0]) : PLACEHOLDER_IMAGE;

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    addToCart(product, 1);
  };

  return (
    <Link to={`/product/${product.id}`} style={styles.cardLink}>
      <div style={styles.card}>
        <img src={mainImage} alt={product.name} style={styles.image} />
        <div style={styles.overlay}>
          <div style={styles.details}>
            <p style={styles.name}>{product.name}</p>
            <p style={styles.price}>${Number(product.price).toFixed(2)}</p>
          </div>
          <button onClick={handleAddToCart} style={styles.addButton} title="Add to Cart">
            <FaPlus />
          </button>
        </div>
      </div>
    </Link>
  );
};

const RecommendedProducts = ({ products }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>You may also like</h2>
      <div style={styles.scrollContainer}>
        {products.map(product => (
          <RecommendedProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { marginTop: '60px', borderTop: '1px solid #eee', paddingTop: '40px' },
  title: { fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '25px' },
  scrollContainer: {
    display: 'flex',
    gap: '20px',
    overflowX: 'auto',
    paddingBottom: '20px', // For scrollbar visibility
    scrollbarWidth: 'thin', // For Firefox
  },
  cardLink: { textDecoration: 'none', flex: '0 0 220px' }, // Fixed width for each card
  card: {
    width: '220px',
    height: '280px',
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
  },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '15px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  details: { color: 'white' },
  name: { margin: '0 0 5px 0', fontWeight: '600', fontSize: '0.9rem' },
  price: { margin: 0, fontSize: '1rem', fontWeight: 'bold' },
  addButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#007bff',
    flexShrink: 0,
  },
};

export default RecommendedProducts;