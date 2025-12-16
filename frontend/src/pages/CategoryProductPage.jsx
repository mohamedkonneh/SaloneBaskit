import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { useMediaQuery } from '../hooks/useMediaQuery';

const CategoryProductPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsRes = await api.get('/products');

        const filtered = productsRes.data.filter(p => p.category === categoryName);
        setProducts(filtered);

      } catch (err) {
        setError('Failed to fetch data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName]);

  return (
    <div>
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      <h1 style={styles.title}>Shop: {categoryName}</h1>
      {loading ? <p>Loading products...</p> : error ? <p style={{ color: 'red' }}>{error}</p> : (
        products.length > 0 ? (
        <div style={styles.productGrid(isMobile)}>
          {products.map(product => (
            <Link to={`/product/${product.id}`} key={product.id} style={{ textDecoration: 'none' }}>
              <ProductCard product={product} onQuickView={setQuickViewProduct} />
            </Link>
          ))}
        </div>
        ) : <p>No products found in this category.</p>
      )}
    </div>
  );
};
const styles = {
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '30px',
    borderBottom: '2px solid #eee',
    paddingBottom: '15px',
  },
  pageContainer: (isMobile) => (isMobile ? {
    display: 'flex',
    height: 'calc(100vh - 120px)', // Adjust based on header/footer height
  } : {}),
  sidebar: {
    flex: '0 0 100px', // Fixed width for the sidebar
    borderRight: '1px solid #eee',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  categoryButton: (isActive) => ({
    padding: '15px 5px',
    border: 'none',
    backgroundColor: isActive ? '#eef6ff' : '#fff',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: isActive ? 'bold' : 'normal',
    color: isActive ? '#004085' : '#333',
    borderBottom: '1px solid #f0f0f0',
  }),
  mainContent: (isMobile) => (isMobile ? {
    flex: 1,
    overflowY: 'auto',
    padding: '0 10px',
  } : {}),
  productGrid: (isMobile) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: isMobile ? '10px' : '25px',
  }),
};

export default CategoryProductPage;

// This component is now only used for the desktop view when no category is selected.
const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <p>Loading categories...</p>;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '30px' }}>All Categories</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {categories.map((category) => (
          <Link to={`/categories/${category.name}`} key={category.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', textAlign: 'center' }}>
              <img src={category.image_url || 'https://placehold.co/300x300'} alt={category.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
              <h3 style={{ fontSize: '1rem', padding: '15px 10px', margin: 0 }}>{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};