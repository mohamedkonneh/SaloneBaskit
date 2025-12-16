import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Correct import path
import { toast } from 'react-toastify'; // Import toast for notifications

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // The login function from context now handles the API call
      const userInfo = await login(email, password);
      toast.success('Login successful! Welcome back.');

      // Conditionally redirect after successful login
      if (userInfo && userInfo.isAdmin) {
        navigate('/admin'); // Redirect admins to the dashboard
      } else {
        navigate('/profile'); // Redirect regular users to their profile
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      console.error('Login error:', err.response || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>SaloneBaskit</h1>
        <p style={styles.subtitle}>Welcome back! Please log in to your account.</p>

        <form onSubmit={onSubmit} noValidate>
          <div style={styles.formGroup}>
            <input type="email" id="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} disabled={loading} required />
          </div>
          <div style={styles.formGroup}>
            <input type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} disabled={loading} required />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>{loading ? 'Logging In...' : 'Log In'}</button>
        </form>
        <p style={styles.redirect}>
          New to SaloneBaskit? <Link to="/register" style={styles.link}>Create an account</Link>
        </p>
      </div>
    </div>
  );
};

// Using similar styles as RegisterPage for consistency
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
