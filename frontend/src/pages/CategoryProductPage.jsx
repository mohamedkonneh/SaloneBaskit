import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';

const CategoryProductPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
  productGrid: (isMobile) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: isMobile ? '10px' : '25px',
  }),
};

export default CategoryProductPage;