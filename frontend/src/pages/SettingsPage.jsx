import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

const SettingsPage = () => {
  const { userInfo, refetchUserInfo } = useAuth();
  
  // State for the name update form
  const [name, setName] = useState(userInfo?.name || '');
  
  // State for the password change form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleNameUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    setIsUpdatingName(true);
    try {
      await api.put('/users/profile', { name });
      await refetchUserInfo();
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      // Note: You will need to create this backend endpoint
      await api.put('/users/profile/password', {
        currentPassword,
        newPassword,
      });
      toast.success('Password changed successfully!');
      // Clear password fields after successful change
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div style={styles.contentPanel}>
      {/* Update Name Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Update Your Profile</h2>
        <form onSubmit={handleNameUpdate}>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              placeholder="Enter your full name"
            />
          </div>
          <button type="submit" style={styles.saveButton} disabled={isUpdatingName}>
            {isUpdatingName ? 'Saving...' : 'Save Name'}
          </button>
        </form>
      </div>

      {/* Change Password Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Change Password</h2>
        <form onSubmit={handlePasswordChange}>
          <div style={styles.formGroup}>
            <label htmlFor="currentPassword" style={styles.label}>Current Password</label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter your current password"
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="newPassword" style={styles.label}>New Password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter your new password"
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              placeholder="Confirm your new password"
            />
          </div>
          <button type="submit" style={styles.saveButton} disabled={isUpdatingPassword}>
            {isUpdatingPassword ? 'Saving...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  contentPanel: { backgroundColor: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #eee' },
  section: { marginBottom: '40px', borderBottom: '1px solid #f0f0f0', paddingBottom: '30px' },
  sectionTitle: { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px', color: '#333' },
  formGroup: { marginBottom: '1.5rem' },
  label: { display: 'block', fontWeight: 'bold', color: '#6c757d', marginBottom: '8px' },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  saveButton: {
    padding: '12px 25px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

export default SettingsPage;