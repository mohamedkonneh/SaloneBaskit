import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { useMediaQuery } from '../hooks/useMediaQuery';
import FeaturedProductCard from './FeaturedProductCard'; // Import the correct card

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

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
          slidesToShow: 2, // Show 2 items on mobile
          slidesToScroll: 2, // Scroll 2 at a time on mobile
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
            <FeaturedProductCard product={product} />
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

export default FeaturedProductsCarousel;