import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMediaQuery } from '../hooks/useMediaQuery';
import SettingsPage from './SettingsPage'; // We'll render this component directly
import { FaUser, FaCog, FaBoxOpen, FaInfoCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../api/axiosConfig';

// Placeholder components for different sections
const ProfileInfo = () => {
  const { userInfo, updateUserInfo } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Assumes an endpoint like PUT /api/users/profile
      const { data } = await api.put('/users/profile', { name, email });
      updateUserInfo(data); // Update context and localStorage
      toast.success('Profile updated successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.contentPanel}>
      <h2>Profile Information</h2>
      <form onSubmit={submitHandler}>
        <div style={styles.formGroup}><label htmlFor="name">Name</label><input type="text" id="name" value={name} onChange={e => setName(e.target.value)} style={styles.input} /></div>
        <div style={styles.formGroup}><label htmlFor="email">Email</label><input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} style={styles.input} /></div>
        <button type="submit" style={styles.saveButton} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </div>
  );
};
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
  const { userInfo, logout, updateUserInfo } = useAuth();
  const navigate = useNavigate();
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleLogout = () => {
    logout();
    toast.info("You have been logged out successfully.");
    navigate('/login');
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoPreview(URL.createObjectURL(file)); // Show preview immediately

    const formData = new FormData();
    formData.append('photo', file);

    try {
      // Assumes an endpoint like POST /api/users/profile/photo
      const { data } = await api.post('/users/profile/photo', formData);
      updateUserInfo(data); // Update user info with new photo URL
      toast.success('Profile photo updated!');
      setPhotoPreview(null); // Clear preview after successful upload
    } catch (error) {
      toast.error(error.response?.data?.message || 'Photo upload failed.');
      setPhotoPreview(null); // Clear preview on error
    }
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
        <aside style={styles.profileCard}>
          <label htmlFor="photo-upload" style={styles.photoContainer}>
            <img src={photoPreview || userInfo?.photoUrl || `https://i.pravatar.cc/150?u=${userInfo?.email}`} alt="Profile" style={styles.profilePhoto} />
            <div style={styles.photoOverlay}>Edit</div>
          </label>
          <input id="photo-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
          <h2 style={styles.profileName}>{userInfo?.name || 'Guest User'}</h2>
          <p style={styles.profileEmail}>{userInfo?.email}</p>
        </aside>
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
  profileCard: {
    flex: '0 0 250px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    textAlign: 'center',
    height: 'fit-content',
  },
  photoContainer: { position: 'relative', cursor: 'pointer', marginBottom: '15px' },
  profilePhoto: { width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  photoOverlay: { position: 'absolute', bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: '50%', padding: '5px', fontSize: '0.7rem' },
  profileName: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    margin: '10px 0 5px 0',
  },
  profileEmail: {
    fontSize: '0.9rem',
    color: '#6c757d',
    margin: 0,
  },
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
  // Form styles for ProfileInfo
  formGroup: { marginBottom: '1.5rem' },
  input: { width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '1rem' },
  saveButton: { padding: '12px 25px', border: 'none', borderRadius: '8px', backgroundColor: '#28a745', color: 'white', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' },
};

export default ProfilePage;