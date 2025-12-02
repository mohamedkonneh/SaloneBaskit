import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:5000';
const PLACEHOLDER_IMAGE = 'https://placehold.co/200x200/e9ecef/6c757d?text=...';

const LandscapeProductCard = ({ product, backgroundColor }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isHovered, setIsHovered] = useState(false);
  const mainImage = product.image_urls && product.image_urls.length > 0 ? `${BACKEND_URL}${product.image_urls[0]}` : PLACEHOLDER_IMAGE;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
      <div 
        style={{ ...styles.card(isMobile, isHovered), backgroundColor: backgroundColor }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={styles.imageContainer(isMobile)}>
          <img src={mainImage} alt={product.name} style={styles.image} />
        </div>
        <div style={styles.content(isMobile)}>
          <h4 style={styles.name(isMobile)}>{product.name}</h4>
          <p style={styles.price(isMobile)}>${Number(product.price).toFixed(2)}</p>
          <button style={styles.button(isMobile)}>Shop Now</button>
        </div>
      </div>
    </Link>
  );
};

const styles = {
  card: (isMobile, isHovered) => ({
    display: 'flex',
    height: isMobile ? '120px' : '160px', // Smaller height on mobile
    borderRadius: '16px',
    overflow: 'hidden',
    color: 'white',
    position: 'relative',
    transform: isHovered ? 'scale(1.03)' : 'scale(1)',
    transition: 'transform 0.3s ease',
  }),
  imageContainer: (isMobile) => ({
    width: isMobile ? '120px' : '160px', // Smaller image on mobile
    height: isMobile ? '120px' : '160px',
    flexShrink: 0,
  }),
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  content: (isMobile) => ({
    padding: isMobile ? '15px' : '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  }),
  name: (isMobile) => ({
    margin: '0 0 8px 0',
    fontSize: isMobile ? '1rem' : '1.1rem',
    fontWeight: 'bold',
  }),
  price: (isMobile) => ({
    margin: '0 0 12px 0',
    fontSize: isMobile ? '0.9rem' : '1rem',
    opacity: 0.9,
  }),
  button: (isMobile, isCardHovered) => ({
    padding: isMobile ? '6px 12px' : '8px 15px',
    border: '2px solid white',
    borderRadius: '20px',
    backgroundColor: 'transparent',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    alignSelf: 'flex-start',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  }),
};

export default LandscapeProductCard;