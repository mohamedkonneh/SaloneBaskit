import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useMediaQuery } from '../hooks/useMediaQuery';

// A placeholder for category images. You can replace this later.
const PLACEHOLDER_IMAGE = 'https://placehold.co/300x300/e9ecef/6c757d?text=Category';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (err) {
        setError('Failed to fetch categories. Please try again later.');
        console.error('Fetch categories error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>All Categories</h1>
      <div style={styles.grid(isMobile)}>
        {categories.map((category) => (
          <Link to={`/categories/${category.name}`} key={category.id} style={styles.cardLink}>
            <div style={styles.card}>
              <img src={category.image_url || PLACEHOLDER_IMAGE} alt={category.name} style={styles.image} />
              <h3 style={styles.cardTitle}>{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px' },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '30px',
    borderBottom: '2px solid #eee',
    paddingBottom: '15px',
  },
  grid: (isMobile) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  }),
  cardLink: { textDecoration: 'none', color: 'inherit' },
  card: { border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', textAlign: 'center', transition: 'box-shadow 0.3s' },
  image: { width: '100%', height: '150px', objectFit: 'cover', backgroundColor: '#f8f9fa' },
  cardTitle: { fontSize: '1rem', padding: '15px 10px', margin: 0 },
};

export default CategoriesPage;