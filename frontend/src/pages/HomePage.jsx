import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'; // Import the configured Axios instance
import ProductCard from '../components/ProductCard'; 
import PromotionalBanner from '../components/PromotionalBanner'; 
import FeaturedProductsCarousel from '../components/FeaturedProductsCarousel';
import QuickViewModal from '../components/QuickViewModal';
import LandscapeProductsCarousel from '../components/LandscapeProductsCarousel';
 
import CollectionsSideModal from '../components/CollectionsSideModal';
import DynamicProductShowcase from '../components/DynamicProductShowcase';
// 💡 Correcting the import path based on common React project structure
// If VideoCard.jsx is in the same folder as HomePage.jsx, use './VideoCard'
// If it is in a dedicated components folder, use '../components/VideoCard'
import VideoCard from '../components/VideoCard'; 

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); 
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCollectionsModalOpen, setIsCollectionsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [carouselKey, setCarouselKey] = useState(Date.now()); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products and categories in parallel
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products'), 
          api.get('/categories')
        ]);
        setAllProducts(productsRes.data);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
        setCarouselKey(Date.now());
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle search logic within HomePage
  useEffect(() => {
    let filtered = allProducts;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setProducts(filtered);
  }, [searchTerm, selectedCategory, allProducts]);

  // Filter for highlighted products to pass to the landscape carousel
  const highlightedProducts = allProducts.filter(p => p.is_highlighted);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div style={styles.page}>
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      <CollectionsSideModal isOpen={isCollectionsModalOpen} onClose={() => setIsCollectionsModalOpen(false)} collections={categories} />
      <main style={styles.main(isMobile)}>
        <section style={styles.bannerSection(isMobile)}>
          <PromotionalBanner onShopNowClick={() => {
            // Example: scroll to all products section or navigate
          }} />
        </section>

<section style={styles.section(isMobile)}>
              <FeaturedProductsCarousel products={products.slice(0, 8)} title="Top Picks For You" onProductClick={handleProductClick} />
            </section>

        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <>
            <section style={styles.section(isMobile)}>
              <h2 style={styles.sectionTitle(isMobile)}>Live From Our Studio</h2>
              <div style={styles.livePromoContainer(isMobile)}>
                <VideoCard 
                  videoUrl="https://www.youtube.com/watch?v=hWVJucr3Il8&pp=ygUOcHJvZHVjdCBhZHZlcnQ%3D" 
                  title="Unboxing The Latest Gadgets"
                  channel="Tech Today"
                  stats="12K views • 1 day ago"
                />
                <VideoCard 
                  videoUrl="https://www.youtube.com/watch?v=2JNMGesMC2Y&pp=ygUOcHJvZHVjdCBhZHZlcnQ%3D" 
                  title="Mastering Online Shopping"
                />
                {/* This container will only be visible on desktop */}
                {!isMobile && (
                  <div style={styles.promoTextContainer}>
                      <h3 style={styles.promoTitle}>Don't Miss Out!</h3>
                      <p style={styles.promoText}>
                        Join our live sessions for exclusive deals, product demos, and unboxings. See what's new and trending, straight from our studio to your screen.
                      </p>
                      <Link to="/live" style={styles.promoButton}>Watch Live</Link>
                  </div>
                )}
              </div>
            </section>

            <section style={styles.section(isMobile)}>
              <LandscapeProductsCarousel products={highlightedProducts} title="Today's Highlights" onProductClick={handleProductClick} />
            </section>

            
            <section style={styles.section(isMobile)}>
              <h2 style={styles.sectionTitle(isMobile)}>All Products</h2>
              <div style={styles.productGrid(isMobile)}>
                {products.map(product => (
                  <Link to={`/product/${product.id}`} key={product.id} style={{ textDecoration: 'none' }}>
                    <ProductCard product={product} onQuickView={setQuickViewProduct} />
                  </Link>
                ))}
              </div>
            </section>

            <section style={styles.section(isMobile)}>
              <FeaturedProductsCarousel products={products.slice(0, 8)} title="More To Love" onProductClick={handleProductClick} />
            </section>

            <section style={styles.section(isMobile)}>
              <DynamicProductShowcase products={allProducts} title="Discover Our Range" />
                           <section style={styles.section(isMobile)}>
              <LandscapeProductsCarousel products={highlightedProducts} title="Editor's Picks" onProductClick={handleProductClick} />
            </section>

            </section>
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
    maxWidth: '1400px',
    margin: '0 auto',
    padding: isMobile ? '20px 15px' : '30px 20px',
  }),
  section: (isMobile) => ({
    marginBottom: isMobile ? '30px' : '50px',
  }),
  bannerSection: (isMobile) => ({
    marginBottom: isMobile ? '20px' : '50px', 
  }),
  sectionTitle: (isMobile) => ({
    fontSize: isMobile ? '1.5rem' : '1.8rem',
    fontWeight: 'bold',
    marginBottom: '20px',
  }),
  livePromoContainer: (isMobile) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : '2fr 1fr 1fr',
    gap: '20px',
    alignItems: 'start',
  }),
  promoTextContainer: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  promoTitle: {
    margin: '0 0 10px 0',
    fontSize: '1.3rem',
    color: '#333',
  },
  promoText: {
    margin: '0 0 20px 0',
    color: '#606060',
    lineHeight: 1.6,
    flexGrow: 1,
  },
  promoButton: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '8px',
    textDecoration: 'none',
    textAlign: 'center',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  productGrid: (isMobile) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: isMobile ? '10px' : '25px',
  }),
};

export default HomePage;