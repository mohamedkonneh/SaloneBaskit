import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import publicApi from '../api/publicApi'; // Import the new public API instance
import { FaStore, FaChevronRight, FaTags } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import ProductCard from '../components/ProductCard';

const BACKEND_URL = 'http://localhost:5000';

const SuppliersListPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState(''); // Ensure this is an empty string, not null
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { userInfo, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersRes, categoriesRes] = await Promise.all([
          publicApi.get('/suppliers'),  // Use publicApi
          publicApi.get('/categories') // Use publicApi
        ]);
        setSuppliers(suppliersRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        setError('Could not fetch initial page data.');
      } finally {
        setLoadingSuppliers(false);
      }
    };
    // Wait for the initial authentication check to complete before fetching data.
    // This ensures that if a user IS logged in, their token is ready to be sent.
    if (!authLoading) {
      fetchData();
    }
  }, [authLoading]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProductsForSupplier = async () => {
      if (!selectedSupplierId) {
        setProducts([]);
        return;
      }
      try {
        setLoadingProducts(true);
        setError('');
        const { data } = await api.get(`/products/supplier/${selectedSupplierId}`);
        setProducts(data);
      } catch (err) {
        setError('Could not fetch products for this supplier.');
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProductsForSupplier();
  }, [selectedSupplierId]);

  const filteredProducts = selectedCategoryId === 'all'
    ? products
    : products.filter(p => p.category === categories.find(c => c.id === selectedCategoryId)?.name);

  if (authLoading || loadingSuppliers) {
    return <p style={{textAlign: 'center', marginTop: '50px'}}>Loading Page...</p>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.container(isMobile)}>
        {/* --- Main Content --- */}
        <main style={styles.mainContent}>
          <div style={styles.pageHeader}>
            <h1 style={styles.title}>Browse by Supplier</h1>
            <p style={styles.subtitle}>Select a supplier to view their products.</p>
          </div>

          {/* Inject a style tag to handle the scrollbar pseudo-element */}
          <style>{`
            .category-nav-scroll::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="category-nav-scroll" style={styles.categoryNav}>
            <div 
              style={{...styles.categoryNavItem, ...(selectedCategoryId === 'all' ? styles.activeCategoryItem : {}), ...(hoveredCategory === 'all' && selectedCategoryId !== 'all' ? styles.hoverCategoryItem : {})}} 
              onClick={() => setSelectedCategoryId('all')}
              onMouseEnter={() => setHoveredCategory('all')}
              onMouseLeave={() => setHoveredCategory(null)}
            >All Products</div>
            {categories.map(cat => (
              <div 
                key={cat.id} 
                style={{...styles.categoryNavItem, ...(selectedCategoryId === cat.id ? styles.activeCategoryItem : {}), ...(hoveredCategory === cat.id && selectedCategoryId !== cat.id ? styles.hoverCategoryItem : {})}} 
                onClick={() => setSelectedCategoryId(cat.id)}
                onMouseEnter={() => setHoveredCategory(cat.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >{cat.name}</div>
            ))}
          </div>

          <div style={styles.controlsHeader}>
            <div style={styles.supplierSelectContainer}>
              <FaStore style={styles.selectIcon} />
              <select 
                value={selectedSupplierId || ''} 
                onChange={(e) => setSelectedSupplierId(e.target.value)} 
                style={styles.supplierSelect}
                disabled={loadingSuppliers}
              >
                <option value="">-- Select a Supplier --</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            {selectedSupplierId && (
              <Link to={`/suppliers/${selectedSupplierId}`} style={styles.visitButton}>
                Visit Store Page <FaChevronRight style={{marginLeft: '5px'}}/>
              </Link>
            )}
          </div>

          {/* --- Products Grid --- */}
          <div style={styles.productGrid(isMobile)}>
            {loadingProducts ? (
              <p>Loading products...</p>
            ) : products.length > 0 ? (
              filteredProducts.map(product => (
                <Link to={`/product/${product.id}`} key={product.id} style={{ textDecoration: 'none' }}>
                  <ProductCard product={product} />
                </Link>
              ))
            ) : (
              selectedSupplierId && <p>This supplier has no products to display.</p>
            )}
          </div>
          {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}
        </main>
      </div>
    </div>
  );
};

const styles = {
  page: { backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' },
  container: (isMobile) => ({ 
    display: 'flex',
    maxWidth: '1400px', 
    margin: '0 auto', 
    padding: isMobile ? '20px 15px' : '40px 20px',
    gap: isMobile ? 0 : '40px',
    flexDirection: 'column', // Ensure main content flows vertically
  }),
  categoryNav: {
    display: 'flex',
    overflowX: 'auto',
    gap: '10px',
    paddingBottom: '20px',
    marginBottom: '10px',
    scrollbarWidth: 'none', // For Firefox - this works as a direct property
  },
  categoryNavItem: {
    padding: '8px 15px',
    borderRadius: '20px',
    backgroundColor: '#e9ecef',
    color: '#495057',
    fontWeight: '500',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'background-color 0.2s, color 0.2s, transform 0.2s',
  },
  activeCategoryItem: {
    backgroundColor: '#007bff',
    color: 'white',
  },
  hoverCategoryItem: {
    backgroundColor: '#d1e7ff', // Lighter blue on hover
    color: '#0056b3',
    transform: 'translateY(-2px)',
  },
  mainContent: {
    flex: 1,
  },
  pageHeader: { textAlign: 'left', marginBottom: '30px' },
  title: { fontSize: '2.2rem', fontWeight: '700', margin: '0 0 5px 0', color: '#111827' },
  subtitle: { fontSize: '1.1rem', color: '#6b7280', margin: 0 },
  controlsHeader: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '30px', 
    backgroundColor: 'white', 
    padding: '15px 20px', 
    borderRadius: '12px', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
  },
  supplierSelectContainer: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
  },
  selectIcon: {
    color: '#9ca3af',
    marginRight: '12px',
  },
  supplierSelect: {
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    background: 'transparent',
    cursor: 'pointer',
    width: '100%',
  },
  visitButton: {
    textDecoration: 'none',
    color: '#007bff',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: '8px',
    backgroundColor: '#eef6ff',
    whiteSpace: 'nowrap',
  },
  productGrid: (isMobile) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: isMobile ? '10px' : '25px',
  }),
};

export default SuppliersListPage;