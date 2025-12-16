import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/users/login', { email, password });
      login(res.data); // res.data should contain user info and token
      toast.success('Login successful! Welcome back.');
      navigate('/profile'); // Redirect to profile page on successful login
    } catch (err) {
      // This is the crucial error handling part
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      console.error('Login error:', err.response || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h1 style={styles.title}>Sign In</h1>
        <p style={styles.subtitle}>Access your SaloneBaskit account</p>
        <form onSubmit={onSubmit}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p style={styles.footerText}>
          Don't have an account? <Link to="/register" style={styles.link}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 20px',
    backgroundColor: '#f4f7f6',
  },
  formWrapper: {
    width: '100%',
    maxWidth: '400px',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  },
  title: { fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: '30px' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  button: {
    width: '100%',
    padding: '15px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#004085',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  footerText: { textAlign: 'center', marginTop: '20px', color: '#666' },
  link: { color: '#004085', textDecoration: 'none', fontWeight: 'bold' },
};

export default LoginPage;