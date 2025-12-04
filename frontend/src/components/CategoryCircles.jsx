import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CategoryCircles.module.css';

// Use Vite's environment variables to define the backend URL for images.
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const PLACEHOLDER_IMAGE = 'https://placehold.co/100x100/e9ecef/6c757d?text=...';

const CategoryCircles = ({ categories }) => {
  return (
    <div className={styles.container}>
      {categories.map(category => {
        let imagePath = null;
        // Check for an array of URLs first, which is common for products.
        if (category.image_urls && category.image_urls.length > 0) {
          imagePath = category.image_urls[0];
        // Fallback to check for a single image URL string, which is common for categories.
        } else if (category.image_url) {
          imagePath = category.image_url;
        }
        const imageUrl = imagePath ? `${BACKEND_URL}${imagePath}` : PLACEHOLDER_IMAGE;

        return (
          <Link to={`/categories/${category.name}`} key={category.id} className={styles.categoryItem}>
            <div 
              className={styles.circle} 
              style={{ backgroundImage: `url(${imageUrl})` }}
            ></div>
            <span className={styles.name}>{category.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default CategoryCircles;