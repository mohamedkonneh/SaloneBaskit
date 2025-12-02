import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <p style={styles.subtitle}>Oops! Page Not Found</p>
      <p style={styles.text}>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <Link to="/" style={styles.button}>
        Go to Homepage
      </Link>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'calc(100vh - 200px)', // Adjust height based on your header/footer
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'system-ui, sans-serif',
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 'clamp(6rem, 20vw, 10rem)',
    fontWeight: 'bold',
    color: '#007bff',
    margin: '0',
    textShadow: '4px 4px 0px #eef6ff',
  },
  subtitle: {
    fontSize: '1.8rem',
    fontWeight: '500',
    color: '#333',
    margin: '10px 0',
  },
  text: {
    fontSize: '1rem',
    color: '#6c757d',
    marginBottom: '30px',
    maxWidth: '400px',
  },
  button: {
    padding: '12px 25px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'none',
  },
};

export default NotFoundPage;