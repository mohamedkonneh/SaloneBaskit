import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { getImageUrl } from '../pages/imageUrl'; // Assuming this helper exists

const PLACEHOLDER_IMAGE = 'https://placehold.co/400x400/e9ecef/6c757d?text=No+Image';

const FeaturedProductCard = ({ product }) => {
  const { convertPrice } = useSettings();

  if (!product) return null;

  // Correctly use the 'image_urls' array to get the first image
  const imageUrl = product.image_urls && product.image_urls.length > 0
    ? getImageUrl(product.image_urls[0]) : PLACEHOLDER_IMAGE;

  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        <img src={imageUrl} alt={product.name} style={styles.image} />
      </div>
      <div style={styles.details}>
        <span style={styles.price}>{convertPrice(product.price)}</span>
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: 'none', // Removed border to ensure price has no background border
    borderRadius: '18px',
    overflow: 'hidden',
    backgroundColor: 'transparent', // Use 'transparent' instead of 'none'
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    margin: '0 10px', // Add margin for spacing in the carousel
  },
  imageContainer: {
    width: '100%',
    paddingTop: '100%', // Creates a square aspect ratio
    position: 'relative',
    backgroundColor: '#f8f9fa',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  details: { padding: '12px' },
  price: { fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }, // Reduced font size for better fit
};

export default FeaturedProductCard;