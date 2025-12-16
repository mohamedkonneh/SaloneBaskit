import React from 'react';

const ProfilePage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Profile</h1>
      <p style={styles.text}>
        This is your profile page. Functionality like viewing order history, managing addresses, and updating account details will be added here soon.
      </p>
      {/* Placeholder for future content */}
      <div style={styles.placeholder}>
        <h3>Order History</h3>
        <p>No orders yet.</p>
      </div>
      <div style={styles.placeholder}>
        <h3>Account Details</h3>
        <p>Details will be editable here.</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  text: {
    fontSize: '1rem',
    color: '#555',
    marginBottom: '40px',
  },
  placeholder: {
    backgroundColor: '#f8f9fa',
    border: '1px dashed #ccc',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
  }
};

export default ProfilePage;