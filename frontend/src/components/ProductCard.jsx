import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaHeart, FaStar } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext'; // Import the settings hook

const PLACEHOLDER_IMAGE = 'https://placehold.co/300x300/e9ecef/6c757d?text=No+Image';
const BACKEND_URL = 'http://localhost:5000';

const ProductCard = ({ product, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { settings } = useSettings(); // Get global settings

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click/navigation
    addToCart(product, 1); // Add 1 item with default options
  };

  const toggleWishlist = (e) => {
    e.stopPropagation(); // Prevent card click event
    setIsWishlisted(!isWishlisted);
  };

  const hasDiscount = product.discounted_price && product.discounted_price < product.price;
  const discountPercentage = hasDiscount ? Math.round(((product.price - product.discounted_price) / product.price) * 100) : 0;

  // Helper function to format price based on selected currency
  const formatPrice = (amount) => {
    return new Intl.NumberFormat(settings.language, {
      style: 'currency',
      currency: settings.currency,
    }).format(amount);
  };

  // Use the new image_urls array
  const mainImage = product.image_urls && product.image_urls.length > 0 ? `${BACKEND_URL}${product.image_urls[0]}` : PLACEHOLDER_IMAGE;
  const hoverImage = product.image_urls && product.image_urls.length > 1 ? `${BACKEND_URL}${product.image_urls[1]}` : mainImage;

  return (
    <div 
      style={{
        ...styles.card(isMobile), 
        transform: !isMobile && isHovered ? 'translateY(-8px)' : 'none', 
        boxShadow: !isMobile && isHovered ? '0 12px 24px rgba(0,0,0,0.12)' : '0 4px 8px rgba(0,0,0,0.06)'
      }}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      <div style={styles.imageContainer}>
        <img 
          src={!isMobile && isHovered ? hoverImage : mainImage} 
          alt={product.name} 
          style={styles.image} 
          onError={(e) => { if (e.target.src !== PLACEHOLDER_IMAGE) e.target.src = PLACEHOLDER_IMAGE; }} 
        />
        <button onClick={toggleWishlist} style={{...styles.wishlistButton, color: isWishlisted ? '#dc3545' : '#ccc'}}>
          <FaHeart />
        </button>
        {!isMobile && isHovered && (
          <button onClick={() => onQuickView(product)} style={styles.quickViewButton}>Quick View</button>
        )}
        {hasDiscount && <div style={styles.discountBadge}>{`-${discountPercentage}%`}</div>}
      </div>
      <div style={styles.content(isMobile)}>
        <div style={styles.mainContent}>
          <h3 style={styles.name(isMobile)}>{product.name}</h3>
          <div style={styles.ratingContainer(isMobile)}>
            <FaStar color="#ffc107" />
            <span style={styles.ratingText}>{Number(product.rating || 0).toFixed(1)}</span>
            <span style={styles.reviewsText}>({product.num_reviews || 0} reviews)</span>
          </div>
        </div>

        <div>
          <div style={styles.priceContainer(isMobile)}>
            {hasDiscount ? (
              <div>
                <p style={styles.discountedPrice(isMobile)}>{formatPrice(product.discounted_price)}</p>
                <p style={styles.originalPrice(isMobile)}>{formatPrice(product.price)}</p>
              </div>
            ) : (
              <p style={styles.price}>{formatPrice(product.price)}</p>
            )}
            <button onClick={handleAddToCart} style={styles.cartButton}>
              <FaShoppingCart />
            </button>
          </div>
          {product.has_free_delivery && <p style={styles.deliveryBadge}>Free Delivery</p>}
          {product.estimated_delivery && <p style={styles.deliveryText}>{product.estimated_delivery}</p>}
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: (isMobile) => ({
    backgroundColor: 'white',
    borderRadius: '6px', // Reduced border radius for a sharper look
    overflow: 'hidden', // Keep overflow hidden
    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smoother transition
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
  }),
  imageContainer: {
    width: '100%',
    paddingTop: '80%', // Further reduced to make the card more compact
    position: 'relative',
    backgroundColor: '#f4f4f4',
  },
  wishlistButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'rgba(255,255,255,0.8)',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  quickViewButton: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    width: '100%',
    padding: '10px',
    border: 'none',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'opacity 0.3s',
  },
  discountBadge: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  content: (isMobile) => ({
    padding: isMobile ? '10px' : '12px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  }),
  mainContent: {
    flexGrow: 1,
  },
  name: (isMobile) => ({
    fontSize: isMobile ? '0.8rem' : '0.9rem',
    fontWeight: '600',
    margin: '0 0 6px 0',
    height: '36px', // Reduced height for 2 lines of text
    overflow: 'hidden', // Hide any text that overflows
    color: '#333',
    lineHeight: '1.3',
  }),
  priceContainer: (isMobile) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: isMobile ? '4px' : '8px',
  }),
  price: {
    fontSize: '1.1rem', // Reduced font size
    fontWeight: 'bold',
    color: '#007bff',
    margin: 0,
  },
  discountedPrice: (isMobile) => ({
    fontSize: isMobile ? '0.9rem' : '1.1rem',
    fontWeight: 'bold',
    color: '#dc3545', // Red for discount
    margin: 0,
  }),
  originalPrice: (isMobile) => ({
    fontSize: isMobile ? '0.75rem' : '0.9rem',
    color: '#6c757d',
    textDecoration: 'line-through',
    margin: 0,
  }),
  ratingContainer: (isMobile) => ({ display: 'flex', alignItems: 'center', color: '#6c757d', fontSize: isMobile ? '0.8rem' : '0.9rem', marginBottom: '8px' }),
  ratingText: { marginLeft: '5px', fontWeight: 'bold' },
  reviewsText: { marginLeft: '5px' },
  deliveryBadge: { backgroundColor: '#e2f5e9', color: '#28a745', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', display: 'inline-block', marginTop: '10px' },
  deliveryText: { color: '#6c757d', fontSize: '0.8rem', margin: '5px 0 0 0' },
  cartButton: {
    background: 'none',
    border: 'none',
    color: '#007bff',
    fontSize: '1.1rem', // Slightly smaller button
    cursor: 'pointer',
  },
};

export default ProductCard;