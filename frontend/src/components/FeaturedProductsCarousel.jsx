import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../pages/imageUrl';
import { useMediaQuery } from '../hooks/useMediaQuery';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const PLACEHOLDER_IMAGE = 'https://placehold.co/250x250/e9ecef/6c757d?text=...';

// --- Local CustomFeaturedCard Component ---
const AddToCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const CustomFeaturedCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const imageUrl = product.image_urls && product.image_urls.length > 0 
    ? getImageUrl(product.image_urls[0]) 
    : PLACEHOLDER_IMAGE;

  return (
    <div 
      style={cardStyles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={imageUrl} alt={product.name} style={cardStyles.image} />
      <div style={cardStyles.price}>${product.price}</div>
      <div style={cardStyles.nameOverlay}>
        <h3 style={cardStyles.name}>{product.name}</h3>
      </div>
      {isHovered && (
        <div style={cardStyles.hoverOverlay}>
          <div style={cardStyles.addToCartIcon} onClick={handleAddToCart}><AddToCartIcon /></div>
        </div>
      )}
    </div>
  );
};
// --- End of Local Component ---

const FeaturedProductsCarousel = ({ products, title, onProductClick }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');

  const settings = {
    dots: true,
    infinite: products.length > 1,
    speed: 500,
    slidesToShow: 4, // Show 4 columns on desktop
    slidesToScroll: 4, // Scroll 4 at a time
    autoplay: true,
    autoplaySpeed: 3000, // Move every 3 seconds
    arrows: true, // Enable navigation arrows
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3, // Show 3 items on tablet
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3, // Show 3 items on mobile
          slidesToScroll: 3, // Scroll 3 at a time on mobile
        }
      }
    ]
  };

  // Only render if there are products to show
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div style={styles.container(isMobile)}>
      <h2 style={styles.title(isMobile)}>{title}</h2>
      <Slider {...settings}>
        {products.map((product, index) => (
          <div 
            key={product.id} 
            style={styles.slideWrapper} 
            onClick={() => onProductClick && onProductClick(product.id)}
          >
            <CustomFeaturedCard product={product} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

const styles = {
  container: (isMobile) => ({
    backgroundColor: '#eef6ff', // A nice, light blue background
    padding: isMobile ? '0 15px' : '0 40px', // Removed top/bottom padding
    margin: 0, // Removed margin
    borderRadius: '16px',
    overflow: 'hidden', // Important for the carousel's look
    height: 'auto' // Use auto height to fit content
    
  }),
  title: (isMobile) => ({
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: '#004085', // Updated header color
    marginBottom: '15px', // Consistent smaller margin
    paddingLeft: 0, // Remove paddingLeft as container now has padding
    textAlign: isMobile ? 'center' : 'left', // Center title on mobile

  }),
  slideWrapper: {
    padding: '0 8px', // Add some spacing between cards
    cursor: 'pointer',
  },
};

// --- Styles for the local CustomFeaturedCard ---
const cardStyles = {
  card: {
    position: 'relative',
    width: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    aspectRatio: '1 / 1',
    border: '1px solid #dee2e6',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  price: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: 'green', // Price color set to green
    fontWeight: 'bold',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.85rem',
  },
  nameOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
    padding: '15px 8px 8px 8px',
    textAlign: 'center',
  },
  name: {
    color: 'white',
    fontSize: '0.8rem', // Small written name
    margin: 0,
    fontWeight: '500',
  },
  hoverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  addToCartIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#007bff',
  },
};

export default FeaturedProductsCarousel;
