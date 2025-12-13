import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaInfoCircle, FaShieldAlt, FaQuestionCircle, FaUndo, FaArrowLeft } from 'react-icons/fa';

const navLinks = [
  { to: '/about', icon: <FaInfoCircle />, text: 'About The Company' },
  { to: '/terms', icon: <FaShieldAlt />, text: 'Terms & Privacy' },
  { to: '/contact', icon: <FaQuestionCircle />, text: 'Contact Us' },
  { to: '/faq', icon: <FaQuestionCircle />, text: 'FAQ' },
  { to: '/return-policy', icon: <FaUndo />, text: 'Return Policy' },
];

const InfoPageLayout = ({ children, title }) => {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <aside style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>Information</h2>
          <nav>
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                style={({ isActive }) => ({
                  ...styles.navLink,
                  ...(isActive ? styles.activeLink : {}),
                })}
              >
                {link.icon}
                <span>{link.text}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
        <main style={styles.mainContent}>
          <Link to="/account" style={styles.backLink}>
            <FaArrowLeft style={{ marginRight: '8px' }} />
            Back to Account
          </Link>
          <h1 style={styles.pageTitle}>{title}</h1>
          <div style={styles.contentBody}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const styles = {
  page: { backgroundColor: '#f9fafb', padding: '40px 20px', minHeight: 'calc(100vh - 130px)' },
  container: {
    display: 'flex',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sidebar: {
    flex: '0 0 280px',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    height: 'fit-content',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  sidebarTitle: { fontSize: '1.4rem', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #eee' },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '12px 15px',
    textDecoration: 'none',
    color: '#333',
    borderRadius: '8px',
    fontWeight: '500',
    marginBottom: '5px',
  },
  activeLink: {
    backgroundColor: '#eef6ff',
    color: '#007bff',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: '#007bff',
    fontWeight: '600',
    marginBottom: '20px',
  },
  mainContent: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  pageTitle: { marginTop: 0, fontSize: '2.2rem', marginBottom: '25px' },
  contentBody: {
    lineHeight: '1.7',
    color: '#333',
    whiteSpace: 'pre-wrap', // This is the magic line!
  },
};

export default InfoPageLayout;