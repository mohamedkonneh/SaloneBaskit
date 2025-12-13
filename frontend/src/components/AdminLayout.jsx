import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { FaBars } from 'react-icons/fa';

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={styles.layout}>
      <AdminSidebar isOpen={isSidebarOpen} />
      <div style={{ ...styles.mainContent, marginLeft: isSidebarOpen ? '250px' : '0' }}>
        <header style={styles.header}>
          <button onClick={toggleSidebar} style={styles.hamburgerButton}>
            <FaBars />
          </button>
        </header>
        <div style={styles.pageContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const styles = {
  layout: {
    display: 'flex',
    backgroundColor: '#f4f6f9',
    minHeight: '100vh',
  },
  mainContent: {
    flexGrow: 1,
    transition: 'margin-left 0.3s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '15px 30px',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
  },
  hamburgerButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  pageContent: {
    padding: '30px',
    flexGrow: 1,
  },
};

export default AdminLayout;