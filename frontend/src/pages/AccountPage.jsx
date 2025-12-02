import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaUserCircle, FaClipboardList, FaBell, FaSignOutAlt, FaCamera, FaInfoCircle, FaShieldAlt, FaQuestionCircle, FaUndo, FaInbox, FaCog } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../api/axiosConfig';
import MyOrdersPage from './MyOrdersPage'; // Re-use existing component
import MailboxPage from './MailboxPage'; // Import the new MailboxPage
import NotificationSettings from '../components/NotificationSettings'; // Import the new component
import SettingsPage from './SettingsPage'; // Import the new SettingsPage

const BACKEND_URL = 'http://localhost:5000';

const AccountPage = () => {
  const { userInfo, updateUserInfo, logout } = useAuth(); // Use updateUserInfo to update context
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab from URL hash or default to 'profile'
  const [activeTab, setActiveTab] = useState(location.hash.replace('#', '') || 'profile');

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [name, setName] = useState(userInfo?.name || '');
  const [avatarPreview, setAvatarPreview] = useState(userInfo?.avatarUrl ? `${BACKEND_URL}${userInfo.avatarUrl}` : null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    // Update URL hash when tab changes
    navigate(`#${activeTab}`, { replace: true });

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [activeTab, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    let avatarUrl = userInfo?.avatarUrl;

    // 1. Upload new avatar if one is selected
    if (avatarFile) {
      const formData = new FormData();
      formData.append('image', avatarFile);
      try {
        const { data } = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        avatarUrl = data.image;
      } catch (uploadError) {
        toast.error('Image upload failed.');
        return;
      }
    }

    // 2. Update user profile with new name and/or avatar URL
    try {
      const { data } = await api.put('/users/profile', { name, avatar_url: avatarUrl });
      
      // Update the user context with the new data using the correct function
      updateUserInfo(data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  return (
    <div style={styles.page(isMobile)}>      
      <div style={styles.tabs}>
        <button onClick={() => setActiveTab('profile')} style={{...styles.tabButton, ...(activeTab === 'profile' ? styles.activeTab : {})}}>
          <FaUserCircle style={styles.icon} /> Profile
        </button>
        <button onClick={() => setActiveTab('orders')} style={{...styles.tabButton, ...(activeTab === 'orders' ? styles.activeTab : {})}}>
          <FaClipboardList style={styles.icon} /> My Orders
        </button>
        <button onClick={() => setActiveTab('mailbox')} style={{...styles.tabButton, ...(activeTab === 'mailbox' ? styles.activeTab : {})}}>
          <FaInbox style={styles.icon} /> Mailbox
        </button>
        <button onClick={() => setActiveTab('notifications')} style={{...styles.tabButton, ...(activeTab === 'notifications' ? styles.activeTab : {})}}>
          <FaBell style={styles.icon} /> Notifications
        </button>
        <button onClick={() => setActiveTab('settings')} style={{...styles.tabButton, ...(activeTab === 'settings' ? styles.activeTab : {})}}>
          <FaCog style={styles.icon} /> Settings
        </button>
      </div>

      <div style={styles.tabContent}>
        {activeTab === 'profile' && (
          <div>
            <form onSubmit={handleProfileUpdate} style={styles.profileSection(isMobile)}>
              <div style={styles.avatarContainer} onClick={() => fileInputRef.current.click()}>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" style={styles.avatarImage} />
                ) : (
                  <FaUserCircle size={80} color="#ccc" />
                )}
                <div style={styles.cameraOverlay}>
                  <FaCamera color="white" />
                </div>
              </div>
              <div style={styles.profileDetails(isMobile)}>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  style={styles.nameInput} 
                />
                <p style={styles.userEmail}>{userInfo?.email}</p>
                <button type="submit" style={styles.saveButton}>Save Changes</button>
              </div>
            </form>
            <div style={styles.logoutContainer}>
              <button onClick={handleLogout} style={styles.logoutButton}>
                <FaSignOutAlt style={{marginRight: '10px'}} /> Logout
              </button>
            </div>
          </div>
        )}
        {activeTab === 'orders' && <MyOrdersPage />}
        {activeTab === 'mailbox' && <MailboxPage />}
        {activeTab === 'notifications' && <NotificationSettings />}
        {activeTab === 'settings' && <SettingsPage />}
      </div>

      {/* --- MOVED INFO LINKS OUTSIDE TAB CONTENT --- */}
      <div style={styles.infoSection}>
        <h3 style={styles.infoTitle}>More Information</h3>
        <Link to="/about" style={styles.infoLink}>
          <FaInfoCircle style={styles.icon} /> About The Company
        </Link>
        <Link to="/terms" style={styles.infoLink}>
          <FaShieldAlt style={styles.icon} /> Terms & Privacy
        </Link>
        <Link to="/contact" style={styles.infoLink}>
          <FaQuestionCircle style={styles.icon} /> Contact Us
        </Link>
        <Link to="/faq" style={styles.infoLink}>
          <FaQuestionCircle style={styles.icon} /> FAQ
        </Link>
        <Link to="/return-policy" style={styles.infoLink}>
          <FaUndo style={styles.icon} /> Return Policy
        </Link>
      </div>
    </div>
  );
};

const styles = {
  page: (isMobile) => ({ 
    maxWidth: '1200px', 
    margin: isMobile ? '20px auto' : '40px auto', 
    padding: isMobile ? '0 15px' : '0 20px', 
    fontFamily: 'system-ui, sans-serif' 
  }),
  profileSection: (isMobile) => ({ 
    display: 'flex', 
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'center', 
    marginBottom: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '12px' 
  }),
  avatarContainer: { position: 'relative', cursor: 'pointer' },
  avatarImage: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileDetails: (isMobile) => ({ 
    marginLeft: isMobile ? 0 : '20px',
    marginTop: isMobile ? '20px' : 0,
    textAlign: isMobile ? 'center' : 'left',
  }),
  nameInput: { border: 'none', borderBottom: '2px solid #eee', fontSize: '1.5rem', fontWeight: 'bold', padding: '5px', outline: 'none', width: '100%' },
  userEmail: { margin: '5px 0 0 0', color: '#6c757d' },
  saveButton: {
    marginTop: '10px',
    padding: '5px 15px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
  },
  tabs: {
    display: 'flex',
    marginBottom: '20px',
    borderBottom: '2px solid #eee',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
  },
  tabButton: {
    padding: '15px 25px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#6c757d',
    borderBottom: '2px solid transparent',
  },
  activeTab: {
    color: '#007bff',
    borderBottom: '2px solid #007bff',
  },
  tabContent: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '40px' },
  icon: { marginRight: '8px' },
  logoutContainer: { marginTop: '20px' },
  logoutButton: {
    width: '100%',
    padding: '15px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: '#ffeef0',
    color: '#dc3545',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    marginTop: '40px',
  },
  infoTitle: {
    fontSize: '1.2rem',
    marginBottom: '15px',
  },
  infoLink: {
    display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#333', padding: '10px 0', fontSize: '1.1rem'
  },
};

export default AccountPage;