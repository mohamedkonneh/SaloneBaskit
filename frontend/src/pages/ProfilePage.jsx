import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMediaQuery } from '../hooks/useMediaQuery';
import SettingsPage from './SettingsPage'; // We'll render this component directly
import { FaUser, FaCog, FaBoxOpen, FaInfoCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // Assuming this is your auth context hook
import { toast } from 'react-toastify';

// Placeholder components for different sections
const ProfileInfo = () => <div style={styles.contentPanel}><h2>Profile Information</h2><p>Edit your name, email, and password here.</p></div>;
const OrderHistory = () => <div style={styles.contentPanel}><h2>Order History</h2><p>No orders yet.</p></div>;
const InfoPages = () => (
  <div style={styles.contentPanel}>
    <h2>Information</h2>
    <p><Link to="/about">About Us</Link></p>
    <p><Link to="/contact">Contact Us</Link></p>
    <p><Link to="/return-policy">Return Policy</Link></p>
    <p><Link to="/privacy">Terms & Privacy</Link></p>
  </div>
);

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info("You have been logged out successfully.");
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileInfo />;
      case 'settings':
        return <SettingsPage />; // Render the full SettingsPage component
      case 'orders':
        return <OrderHistory />;
      case 'info':
        return <InfoPages />;
      default:
        return <ProfileInfo />;
    }
  };

  const navItems = [
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    { id: 'settings', label: 'Settings', icon: <FaCog /> },
    { id: 'orders', label: 'My Orders', icon: <FaBoxOpen /> },
    { id: 'info', label: 'Information', icon: <FaInfoCircle /> },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.mainTitle}>My Account</h1>
      <div style={styles.layout(isMobile)}>
        <aside style={styles.sidebar(isMobile)}>
          {navItems.map(item => (
            <button 
              key={item.id} 
              style={styles.navButton(activeTab === item.id)} 
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon} <span style={styles.navLabel}>{item.label}</span>
            </button>
          ))}
          <button style={styles.logoutButton} onClick={handleLogout}>
            <FaSignOutAlt /> <span style={styles.navLabel}>Logout</span>
          </button>
        </aside>
        <main style={styles.content(isMobile)}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px', maxWidth: '1200px', margin: '0 auto' },
  mainTitle: { fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px' },
  layout: (isMobile) => ({
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: '30px',
  }),
  sidebar: (isMobile) => ({
    flex: isMobile ? '1 1 auto' : '0 0 250px',
    display: 'flex',
    flexDirection: isMobile ? 'row' : 'column',
    gap: '10px',
    overflowX: isMobile ? 'auto' : 'visible',
    paddingBottom: isMobile ? '10px' : '0',
  }),
  navButton: (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    width: '100%',
    padding: '15px',
    border: 'none',
    borderRadius: '8px',
    textAlign: 'left',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: isActive ? '#e9ecef' : 'transparent',
    color: isActive ? '#004085' : '#333',
    fontWeight: isActive ? 'bold' : 'normal',
    transition: 'background-color 0.2s, color 0.2s',
  }),
  navLabel: { whiteSpace: 'nowrap' },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    width: '100%',
    padding: '15px',
    border: 'none',
    borderRadius: '8px',
    textAlign: 'left',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: '#dc3545',
    marginTop: 'auto', // Pushes logout to the bottom in column layout
  },
  content: (isMobile) => ({
    flex: 1,
    minWidth: 0, // Prevents overflow in flex container
  }),
  contentPanel: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    border: '1px solid #eee',
  },
};

export default ProfilePage;