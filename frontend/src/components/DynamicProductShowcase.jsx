import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../pages/imageUrl';

const PLACEHOLDER_IMAGE = 'https://placehold.co/250x250/e9ecef/6c757d?text=...';

// A palette of colors to cycle through for the border
const borderColors = ['#007bff', '#dc3545', '#28a745', '#ffc107', '#6f42c1'];

const DynamicProductShowcase = ({ products, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [colorIndex, setColorIndex] = useState(0); // State to track the current color

  // Helper to get a slice of 4 products, looping if necessary
  const getProductsForDisplay = (startIndex) => {
    const displayProducts = [];
    if (products.length === 0) return [];
    for (let i = 0; i < 4; i++) {
      displayProducts.push(products[(startIndex + i) % products.length]);
    }
    return displayProducts;
  };

  const [currentProducts, setCurrentProducts] = useState(getProductsForDisplay(0));

  useEffect(() => {
    if (products.length < 4) {
      setCurrentProducts(products); // Show what we have if less than 4
      return;
    }

    const interval = setInterval(() => {
      setIsFading(true); // This will trigger the flip animation

      // Wait for the flip to be halfway before swapping the content
      setTimeout(() => {
        setCurrentIndex(prevIndex => {
          const nextIndex = (prevIndex + 4) >= products.length ? 0 : prevIndex + 4;
          setCurrentProducts(getProductsForDisplay(nextIndex));
          setColorIndex(prevColorIndex => (prevColorIndex + 1) % borderColors.length); // Cycle to the next color
          setIsFading(false); // This will trigger the second half of the flip
          return nextIndex;
        });
      }, 250); // This duration should be HALF the CSS transition duration

    }, 5000); // Change images every 5 seconds

    return () => clearInterval(interval);
  }, [products]);

  if (products.length === 0) {
    return null; // Don't render if there are no products
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>{title}</h2>
      <div style={{
        ...styles.imageGrid,
        // Apply transform for the flip animation
        transform: isFading ? 'rotateY(90deg)' : 'rotateY(0deg)',
        transition: 'transform 0.5s ease-in-out'
      }}>
        {currentProducts.map((product, index) => (
          product ? (
            <Link 
              to={`/product/${product.id}`} 
              key={`${product.id}-${currentIndex}-${index}`} 
              style={{...styles.imageLink, borderColor: borderColors[colorIndex]}}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img 
                src={product.image_urls && product.image_urls.length > 0 ? getImageUrl(product.image_urls[0]) : PLACEHOLDER_IMAGE}
                alt={product.name}
                style={styles.image}
              />
            </Link>
          ) : null
        ))}
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#e9ecef', // Greyscale background color
    borderRadius: '16px',
    padding: '20px', // Reduced padding
    boxShadow: '0 8px 25px rgba(0,0,0,0.07)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    perspective: '1000px', // Add perspective for the 3D flip effect
  },
  title: {
    fontSize: '1.6rem', // Reduced font size
    fontWeight: 'bold',
    color: '#495057', // Different title color
    marginBottom: '20px', // Reduced margin
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px', // Reduced gap
    width: '100%',
    maxWidth: '400px', // Reduced max width to make images smaller
    transformStyle: 'preserve-3d', // Necessary for 3D transforms on children
  },
  imageLink: {
    textDecoration: 'none',
    display: 'block',
    borderRadius: '8px', // Slightly smaller border radius
    overflow: 'hidden',
    border: '2px solid', // Set a solid border, the color will be applied dynamically
    boxShadow: '0 4px 10px rgba(0,0,0,0.08)', // Add a subtle shadow
    aspectRatio: '1 / 1', // Ensure images are square
    transition: 'transform 0.3s ease', // Add transition for the hover effect
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
};

export default DynamicProductShowcase;