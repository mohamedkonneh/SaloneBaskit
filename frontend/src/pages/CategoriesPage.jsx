import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { getImageUrl } from './imageUrl';
const PLACEHOLDER_IMAGE = 'https://placehold.co/300x300/e9ecef/6c757d?text=No+Image';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return <div style={styles.centered}>Loading categories...</div>;
  }

  return (
    <div style={styles.container(isMobile)}>
      <h1 style={styles.title}>All Categories</h1>
      <div style={styles.grid(isMobile)}>
        {categories.map(category => (
          <Link to={`/categories/${category.name}`} key={category.id} style={styles.cardLink}>
            <div style={styles.card}>
              <img 
                src={category.image_url ? getImageUrl(category.image_url) : PLACEHOLDER_IMAGE} 
                alt={category.name} 
                style={styles.image} 
              />
              <div style={styles.overlay}>
                <h3 style={styles.categoryName}>{category.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: (isMobile) => ({
    maxWidth: '1200px',
    margin: '0 auto',
    padding: isMobile ? '20px 15px' : '40px 20px',
  }),
  title: {
    fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
    fontWeight: 'bold',
    marginBottom: '30px',
    textAlign: 'center',
    color: '#333',
  },
  grid: (isMobile) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: isMobile ? '15px' : '25px',
  }),
  cardLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  card: {
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    aspectRatio: '1 / 1',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
    padding: '40px 15px 15px 15px',
  },
  categoryName: {
    color: 'white',
    fontSize: '1.1rem',
    fontWeight: '600',
    margin: 0,
    textAlign: 'center',
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    fontSize: '1.2rem',
  }
};

export default CategoriesPage;