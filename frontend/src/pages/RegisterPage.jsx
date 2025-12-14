import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axiosConfig';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { updateUserInfo } = useAuth(); // Use updateUserInfo to set auth state from registration response
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // Use the api instance. The baseURL is already configured.
      const { data } = await api.post('/users/register', { name, email, password });
      updateUserInfo(data); // Set the user state with the response from the register endpoint
      navigate('/'); // Redirect to home page after registration
    } catch (err) {
      // Use the detailed error message from the backend
      const message = err.response?.data?.message || 'An unexpected error occurred during registration.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>SaloneBaskit</h1>
        <p style={styles.subtitle}>Create an account to start your shopping experience.</p>

        {error && <p style={{color: 'red', marginBottom: '1rem'}}>{error}</p>}
        <form onSubmit={submitHandler} noValidate>
          <div style={styles.formGroup}>
            <input
              type="text"
              id="name"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              disabled={loading}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <input type="email" id="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} disabled={loading} required />
          </div>
          <div style={styles.formGroup}>
            <input type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} disabled={loading} required />
          </div>
          <div style={styles.formGroup}>
            <input type="password" id="confirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={styles.input} disabled={loading} required />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        </form>
        <p style={styles.redirect}>
          Already have an account? <Link to="/login" style={styles.link}>Log In</Link>
        </p>
      </div>
    </div>
  );
};

// Using same styles as LoginPage for consistency
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

export default RegisterPage;