import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Correct import from the new hooks directory

// Assuming you have some components for messages and loading spinners
// import Message from '../components/Message';
// import Loader from '../components/Loader';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State for handling errors and loading
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { search } = useLocation();
  const { userInfo, login } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (userInfo) {
      const redirectPath = new URLSearchParams(search).get('redirect') || '/';
      navigate(redirectPath);
    }
  }, [userInfo, navigate, search]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setLoading(true);

    try {
      await login(email, password);
      // The useEffect above will handle the redirect on successful login
    } catch (err) {
      // This is where we catch the error from the API
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false); // Stop loading indicator in both success and error cases
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>SaloneBaskit</h1>
        <p style={styles.subtitle}>Login to continue your unlimited shopping experience.</p>

        {error && <p style={{color: 'red'}}>{error}</p>}
        {loading && <p>Signing in...</p>}

        <form onSubmit={submitHandler}>
          <div style={styles.formGroup}>
            <input type="email" id="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required disabled={loading} />
          </div>
          <div style={styles.formGroup}>
            <input type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required disabled={loading} />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p style={styles.redirect}>
          New Customer? <Link to="/register" style={styles.link}>Register</Link>
        </p>
      </div>
    </div>
  );
};

// Using same styles as RegisterPage for consistency
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'system-ui, sans-serif', padding: '20px' },
  content: { width: '100%', maxWidth: '400px', textAlign: 'center' },
  title: { fontSize: '3rem', fontWeight: 'bold', color: '#007bff', marginBottom: '1rem' },
  subtitle: { fontSize: '1.1rem', color: '#666', marginBottom: '2rem' },
  formGroup: { marginBottom: '1.5rem' },
  input: { width: '100%', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box', fontSize: '1rem', backgroundColor: '#fff' },
  button: { width: '100%', padding: '1rem', border: 'none', borderRadius: '8px', backgroundColor: '#007bff', color: 'white', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.3s' },
  redirect: { textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' },
  link: { color: '#007bff', textDecoration: 'none', fontWeight: 'bold' },
};

export default LoginPage;
