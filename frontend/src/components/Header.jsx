import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaUserCog, FaShoppingCart, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
  const { userInfo, logout } = useAuth();

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          SaloneBaskit
        </Link>

        <nav style={styles.nav}>
          {/* Conditionally render the Admin Dashboard link */}
          {userInfo && userInfo.isAdmin && (
            <NavLink to="/admin" style={styles.navLink} title="Admin Dashboard">
              <FaUserCog size={20} />
              <span style={styles.navText}>Admin</span>
            </NavLink>
          )}

          <NavLink to="/cart" style={styles.navLink} title="Shopping Cart">
            <FaShoppingCart size={20} />
            <span style={styles.navText}>Cart</span>
          </NavLink>

          {userInfo ? (
            <>
              <NavLink to="/profile" style={styles.navLink} title="My Profile">
                <FaUserCircle size={20} />
                <span style={styles.navText}>{userInfo.name.split(' ')[0]}</span>
              </NavLink>
              <button onClick={logout} style={styles.logoutButton} title="Logout">
                <FaSignOutAlt size={20} />
              </button>
            </>
          ) : (
            <NavLink to="/login" style={styles.navLink} title="Login">
              <FaUserCircle size={20} />
              <span style={styles.navText}>Login</span>
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: 'white',
    padding: '15px 30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    fontFamily: 'system-ui, sans-serif',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#007bff',
    textDecoration: 'none',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '25px',
  },
  navLink: {
    color: '#495057',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    padding: '8px 0',
    position: 'relative',
  },
  navText: {
    '@media (maxWidth: 768px)': {
      display: 'none',
    },
  },
  logoutButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#dc3545',
    display: 'flex',
    alignItems: 'center',
  },
};

export default Header;