import React from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

const CategoriesPage = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div style={styles.container(isMobile)}>
      <h2 style={styles.title(isMobile)}>Welcome to our Categories</h2>
      <p style={styles.text(isMobile)}>
        {isMobile 
          ? 'Please select a category to start browsing products.' 
          : 'Please select a category from the left to start browsing products.'}
      </p>
    </div>
  );
};

const styles = {
  container: (isMobile) => ({
    textAlign: 'center',
    padding: isMobile ? '40px 20px' : '50px',
    backgroundColor: 'white',
    borderRadius: '8px',
    minHeight: '300px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  title: (isMobile) => ({ fontSize: isMobile ? '1.5rem' : '1.8rem', marginBottom: '15px', color: '#333' }),
  text: (isMobile) => ({ fontSize: isMobile ? '0.9rem' : '1rem', color: '#6c757d', maxWidth: '400px', lineHeight: '1.5' }),
};

export default CategoriesPage;