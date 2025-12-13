import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
 
import ProductDetailsCard from '../components/ProductDetailsCard';
import ProductCard from '../components/ProductCard';
 

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch current product, all categories, and all products in parallel
        const [productRes, categoriesRes, allProductsRes] = await Promise.all([
          api.get(`/products/${productId}`),
          api.get('/categories'),
          api.get('/products')
        ]);

        const currentProduct = productRes.data;
        setProduct(currentProduct);
        setCategories(categoriesRes.data);

        // Filter for related products from the same category
        const related = allProductsRes.data.filter(p => p.category?.id === currentProduct.category?.id && p.id !== currentProduct.id);
        setRelatedProducts(related.slice(0, 4)); // Show up to 4 related products

      } catch (err) {
        setError('Failed to fetch product details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return ( // No change needed here, it's a public page.
    <div style={styles.page}>
      {/* Inject a style tag to handle the scrollbar pseudo-element */}
      <style>{`
        .category-nav-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {/* Category Navigation Bar */}
      <div className="category-nav-scroll" style={styles.categoryNav}>
        {categories.map(cat => (
          <Link to={`/categories/${cat.name}`} key={cat.id} style={styles.categoryLink}>
            {cat.name}
          </Link>
        ))}
      </div>

      <main style={styles.main(isMobile)}>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <>
            <ProductDetailsCard product={product} />
            {relatedProducts.length > 0 && (
              <div style={styles.relatedSection}>
                <h2 style={styles.relatedTitle}>You Might Also Like</h2>
                <div style={styles.relatedGrid}>
                  {relatedProducts.map(p => (
                    <Link to={`/product/${p.id}`} key={p.id} style={{ textDecoration: 'none' }}>
                      <ProductCard product={p} />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: '#f4f6f9',
    minHeight: '100vh',
  },
  main: (isMobile) => ({
    maxWidth: '1200px',
    margin: isMobile ? '20px auto' : '40px auto',
    padding: '0 20px',
  }),
  categoryNav: {
    display: 'flex',
    justifyContent: 'flex-start', // Align items to the start for scrolling
    flexWrap: 'nowrap', // Prevent wrapping
    gap: '10px',
    padding: '15px',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    overflowX: 'auto', // Enable horizontal scrolling
    scrollbarWidth: 'none', // For Firefox - this works as a direct property
  },
  categoryLink: {
    textDecoration: 'none',
    color: '#333',
    backgroundColor: '#f0f2f5',
    padding: '8px 15px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '500',
    whiteSpace: 'nowrap', // Prevent text from wrapping inside the link
    transition: 'background-color 0.2s',
  },
  relatedSection: {
    marginTop: '60px',
  },
  relatedTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '25px',
  },
  relatedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '25px',
  },
};

export default ProductDetailsPage;