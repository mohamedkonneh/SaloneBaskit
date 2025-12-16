import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { useMediaQuery } from '../hooks/useMediaQuery';

const CategoryProductPage = () => {
  const { categoryName } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [activeCategory, setActiveCategory] = useState(categoryName || 'All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all data concurrently for speed
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        
        setAllProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        setError('Failed to fetch data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Filter products whenever the active category or the full product list changes
    if (activeCategory === 'All') {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter(p => p.category === activeCategory);
      setProducts(filtered);
    }
  }, [activeCategory, allProducts]);

  // If not mobile and no category is selected, render the main categories page instead.
  if (!isMobile && !categoryName) {
    return <CategoriesPage />;
  }

  return (
    <div style={styles.pageContainer(isMobile)}>
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      {isMobile && (
        <aside style={styles.sidebar}>
          <button onClick={() => setActiveCategory('All')} style={styles.categoryButton(activeCategory === 'All')}>All</button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.name)} style={styles.categoryButton(activeCategory === cat.name)}>
              {cat.name}
            </button>
          ))}
        </aside>
      )}
      <main style={styles.mainContent(isMobile)}>
        <h1 style={styles.title}>Shop: {activeCategory}</h1>
        {loading ? <p>Loading...</p> : error ? <p style={{ color: 'red' }}>{error}</p> : (
          products.length > 0 ? (
          <div style={styles.productGrid(isMobile)}>
            {products.map(product => (
              <Link to={`/product/${product.id}`} key={product.id} style={{ textDecoration: 'none' }}>
                {/* Pass supplier name only when a specific category is active */}
                <ProductCard product={product} onQuickView={setQuickViewProduct} showSupplier={activeCategory !== 'All'} />
              </Link>
            ))}
          </div>
          ) : <p>No products found in this category.</p>
      )}
      </main>
    </div>
  ); // Added missing closing parenthesis
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