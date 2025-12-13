import React from 'react';

const AdminDashboardPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Admin Dashboard</h1>
      <p>Welcome to the admin dashboard. Here you can manage products, users, and orders.</p>
      {/* In the future, you can add stats and summary cards here */}
    </div>
  );
};

const styles = {
  container: { 
    fontFamily: 'system-ui, sans-serif' 
  },
  header: { 
    marginBottom: '20px' 
  },
};

export default AdminDashboardPage;