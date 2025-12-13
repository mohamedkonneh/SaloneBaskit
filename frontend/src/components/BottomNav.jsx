import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaThLarge, FaShoppingCart, FaStore, FaUserShield } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';

const BottomNav = () => {
  const { userInfo } = useAuth();
  const { cartItems } = useCart();

  return (
    <nav style={styles.nav}>
      <NavLink to="/" style={({ isActive }) => (isActive ? { ...styles.link, ...styles.activeLink } : styles.link)}>
        <FaHome size={22} />
        <span style={styles.label}>Home</span>
      </NavLink>
      <NavLink to="/categories" style={({ isActive }) => (isActive ? { ...styles.link, ...styles.activeLink } : styles.link)}>
        <FaThLarge size={22} />
        <span style={styles.label}>Categories</span>
      </NavLink>
      <NavLink to="/cart" style={({ isActive }) => (isActive ? { ...styles.link, ...styles.activeLink } : styles.link)}>
        <div style={styles.cartIconContainer}>
          <FaShoppingCart size={22} />
          {cartItems.length > 0 && <span style={styles.cartBadge}>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>}
        </div>
        <span style={styles.label}>Cart</span>
      </NavLink>
      <NavLink to="/suppliers" style={({ isActive }) => (isActive ? { ...styles.link, ...styles.activeLink } : styles.link)}>
        <FaStore size={22} />
        <span style={styles.label}>Suppliers</span>
      </NavLink>
      {userInfo && userInfo.isAdmin && (
        <NavLink to="/admin" style={({ isActive }) => (isActive ? { ...styles.link, ...styles.activeLink } : styles.link)}>
          <FaUserShield size={22} />
          <span style={styles.label}>Admin</span>
        </NavLink>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60px',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  },
  link: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    color: '#8e8e93',
    flexGrow: 1,
    height: '100%',
  },
  activeLink: {
    color: '#007bff',
  },
  label: {
    fontSize: '12px',
    marginTop: '4px',
  },
  cartIconContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: '-5px',
    right: '-10px',
    backgroundColor: '#dc3545',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '10px',
    fontWeight: 'bold',
  },
};

export default BottomNav;