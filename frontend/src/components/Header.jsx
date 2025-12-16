import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '../hooks/useMediaQuery';
// You can also import your cart context to display a cart count
// import { useCart } from '../context/CartContext';

// --- SVG Icons for a clean, dependency-free implementation ---
const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const HamburgerIcon = ({ onClick }) => (
  <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);

const Header = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Example: const { cart } = useCart();
  // const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const renderNavLinks = (isMobileLayout = false) => (
    <div style={styles.navLinks(isMobileLayout)}>
      {navLinks.map(link => (
        <Link to={link.path} key={link.name} style={styles.navLink(isMobileLayout)} onClick={() => setMobileMenuOpen(false)}>
          {link.name}
        </Link>
      ))}
    </div>
  );

  return (
    <>
      <header style={styles.header}>
        <nav style={styles.nav}>
          <Link to="/" style={styles.logo}>
            SaloneBaskit
          </Link>

          {isMobile ? (
            <HamburgerIcon onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} />
          ) : (
            <>
              {renderNavLinks()}
              <div style={styles.actionIcons}>
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
      {isMobile && isMobileMenuOpen && (
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
    alignItems: 'center',
    padding: '0 20px',
    height: '70px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#004085',
    textDecoration: 'none',
  },
  navLinks: (isMobile) => ({
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'center' : 'center',
    gap: isMobile ? '20px' : '30px',
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
    gap: '20px',
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
    right: '-10px',
    backgroundColor: '#dc3545',
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
    borderTop: '1px solid #eee',
    paddingTop: '30px',
  }
};

export default Header;
 