import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '../hooks/useMediaQuery';
import api from '../api/axiosConfig';
// You can also import your cart context to display a cart count
// import { useCart } from '../context/CartContext';

// --- SVG Icons for a clean, dependency-free implementation ---
const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

const HamburgerIcon = ({ onClick }) => (
  <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);

const Header = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  // Example: const { cart } = useCart();
  // const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories for search", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search logic, e.g., navigate to a search results page
    console.log('Searching for:', searchTerm);
  };

  const renderNavLinks = (isMobileLayout = false) => (
    <div style={styles.navLinks(isMobileLayout)}>
      {navLinks.map(link => (
        <Link to={link.path} key={link.name} style={styles.navLink(isMobileLayout)} onClick={() => setMobileMenuOpen(false)}>
          {link.name}
        </Link>
      ))}
    </div>
  );

  const SearchBar = () => (
    <form style={styles.searchContainer} onSubmit={handleSearch}>
      <select style={styles.categorySelect}>
        <option value="all">All</option>
        {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
      </select>
      <input 
        type="text" 
        placeholder="Search for products..." 
        style={styles.searchInput}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit" style={styles.searchButton}>
        <SearchIcon />
      </button>
    </form>
  );

  return (
    <>
      <header style={styles.header}>
        <nav style={styles.nav}>
          {isMobile ? (
            <div style={styles.mobileHeaderWrapper}>
              <div style={styles.mobileTopBar}>
                <HamburgerIcon onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} />
                <div style={{flex: 1, padding: '0 10px'}}><SearchBar /></div>
                <Link to="/cart" style={styles.iconLink}><CartIcon /></Link>
              </div>
              <Link to="/" style={styles.mobileLogo}>SaloneBaskit</Link>
            </div>
          ) : (
            <>
              <Link to="/" style={styles.logo}>SaloneBaskit</Link>
              <div style={{flex: 1, maxWidth: '600px'}}><SearchBar /></div>
              <div style={styles.actionIcons}>
                <HamburgerIcon onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} />
                <Link to="/profile" style={styles.iconLink}><UserIcon /></Link>
                <Link to="/cart" style={styles.iconLink}>
                  <CartIcon />
                  {/* Optional: Cart count */}
                  {/* {cartItemCount > 0 && <span style={styles.cartCount}>{cartItemCount}</span>} */}
                </Link>
              </div>
            </>
          )}
        </nav>
      </header>
      {isMobileMenuOpen && (
        <div style={styles.mobileMenu}>
          {renderNavLinks(true)}
           <div style={styles.mobileActionIcons}>
              <Link to="/profile" style={styles.iconLink} onClick={() => setMobileMenuOpen(false)}><UserIcon /> Profile</Link>
              <Link to="/cart" style={styles.iconLink} onClick={() => setMobileMenuOpen(false)}><CartIcon /> Cart</Link>
            </div>
        </div>
      )}
    </>
  );
};

const styles = {
  header: {
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    width: '100%',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center', // Vertically center items
    padding: '0 20px',
    minHeight: '70px', // Use min-height for mobile flexibility
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logo: { // Desktop logo
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#004085',
    textDecoration: 'none',
  },
  navLinks: (isMobile) => ({
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'center' : 'center',
    gap: '30px',
  }),
  navLink: (isMobile) => ({
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
    fontSize: isMobile ? '1.2rem' : '1rem',
    transition: 'color 0.2s',
  }),
  actionIcons: {
    display: 'flex',
    alignItems: 'center',
    gap: '25px',
  },
  iconLink: {
    color: '#333',
    textDecoration: 'none',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  cartCount: {
    position: 'absolute',
    top: '-5px',
    right: '-10px',    backgroundColor: '#dc3545',
    color: 'white',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '0.7rem',
    fontWeight: 'bold',
  },
  mobileMenu: {
    position: 'fixed',
    top: '70px', // Position below the header
    left: 0,
    width: '100%',
    height: 'calc(100vh - 70px)',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '30px',
    zIndex: 999,
  },
  mobileActionIcons: {
    display: 'flex',
    gap: '30px',
    marginTop: '20px',
    borderTop: '1px solid #ddd',
    paddingTop: '30px',
  },
  // --- Mobile Specific Styles ---
  mobileHeaderWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px 0',
  },
  mobileTopBar: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  mobileLogo: {
    fontSize: '1.2rem', // Smaller logo for mobile
    fontWeight: 'bold',
    color: '#004085',
    textDecoration: 'none',
    textAlign: 'center',
    marginTop: '8px', // Space between search bar and logo
  },
  // --- Search Bar Styles ---
  searchContainer: {
    display: 'flex',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '25px',
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
  },
  categorySelect: {
    border: 'none',
    backgroundColor: '#eee',
    padding: '0 10px',
    color: '#555',
    outline: 'none',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    padding: '10px',
    fontSize: '0.9rem',
    outline: 'none',
    backgroundColor: 'transparent',
  },
  searchButton: {
    border: 'none',
    backgroundColor: '#004085',
    color: 'white',
    padding: '0 15px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  }
};

export default Header;