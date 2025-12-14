import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaTachometerAlt, FaBoxOpen, FaUsers, FaClipboardList, FaSignOutAlt, FaTruck, FaTags, FaUserCircle, FaFileAlt, FaCommentDots } from 'react-icons/fa';
import { getImageUrl } from '../pages/imageUrl';

const AdminSidebar = ({ isOpen }) => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clears auth state and localStorage
    navigate('/login', { replace: true }); // Navigates to login page
  };

  return (
    <div style={{ ...styles.sidebar, width: isOpen ? '250px' : '0' }}>
      <div style={styles.sidebarContent}>
        <div style={styles.profileSection}>
          <div style={styles.avatar}>
            {userInfo?.avatarUrl ? (
              <img src={getImageUrl(userInfo.avatarUrl)} alt="Avatar" style={styles.avatarImage} />
            ) : (
              <FaUserCircle size={40} />
            )}
          </div>
          <h3 style={styles.adminName}>{userInfo?.name || 'Admin User'}</h3>
          <p style={styles.adminRole}>Administrator</p>
        </div>

        <nav style={styles.nav}>
          <NavLink to="/admin" end style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.activeLink : {}) })}>
            <FaTachometerAlt style={styles.icon} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/products" style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.activeLink : {}) })}>
            <FaBoxOpen style={styles.icon} />
            <span>Products</span>
          </NavLink>
          <NavLink to="/admin/users" style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.activeLink : {}) })}>
            <FaUsers style={styles.icon} />
            <span>Users</span>
          </NavLink>
          <NavLink to="/admin/orders" style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.activeLink : {}) })}>
            <FaClipboardList style={styles.icon} />
            <span>Orders</span>
          </NavLink>
          <NavLink to="/admin/suppliers" style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.activeLink : {}) })}>
            <FaTruck style={styles.icon} />
            <span>Suppliers</span>
          </NavLink>
          <NavLink to="/admin/categories" style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.activeLink : {}) })}>
            <FaTags style={styles.icon} />
            <span>Categories</span>
          </NavLink>
          <NavLink to="/admin/content" style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.activeLink : {}) })}>
            <FaFileAlt style={styles.icon} />
            <span>Content</span>
          </NavLink>
          <NavLink to="/admin/messages" style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.activeLink : {}) })}>
            <FaCommentDots style={styles.icon} />
            <span>Messages</span>
          </NavLink>
        </nav>

        <div style={styles.logoutSection}>
          <button onClick={handleLogout} style={styles.logoutButton}>
            <FaSignOutAlt style={styles.icon} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: '#1a222d',
    color: '#c8c8c8',
    overflowX: 'hidden',
    transition: 'width 0.3s ease-in-out',
    zIndex: 1100,
    fontFamily: 'system-ui, sans-serif',
  },
  sidebarContent: {
    width: '250px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  profileSection: {
    padding: '20px',
    textAlign: 'center',
    borderBottom: '1px solid #2a3440',
  },
  avatar: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    backgroundColor: '#007bff',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    margin: '0 auto 10px',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '50%',
  },
  adminName: {
    margin: 0,
    color: 'white',
    fontWeight: '600',
  },
  adminRole: {
    margin: 0,
    fontSize: '0.8rem',
    color: '#8c98a8',
  },
  nav: {
    flexGrow: 1,
    padding: '20px 0',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    color: '#c8c8c8',
    textDecoration: 'none',
    transition: 'background-color 0.2s, color 0.2s',
  },
  activeLink: {
    backgroundColor: '#007bff',
    color: 'white',
  },
  icon: {
    marginRight: '15px',
    minWidth: '20px',
  },
  logoutSection: {
    padding: '20px',
    borderTop: '1px solid #2a3440',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '12px 20px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#c8c8c8',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

export default AdminSidebar;