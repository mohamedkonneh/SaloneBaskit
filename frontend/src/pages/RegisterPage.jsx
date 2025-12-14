import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axiosConfig';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth(); // Use the login function for consistency
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Use the api instance. The baseURL is already configured.
      await api.post('/users/register', { name, email, password });
      await login(email, password); // Log the user in immediately after successful registration
      navigate('/'); // Redirect to home page after registration
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>SaloneBaskit</h1>
        <p style={styles.subtitle}>Create an account to start your shopping experience.</p>

        {error && <p style={{color: 'red'}}>{error}</p>}
        <form onSubmit={submitHandler}>
          <div style={styles.formGroup}>
            <input
              type="text"
              id="name"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <input type="email" id="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
          </div>
          <div style={styles.formGroup}>
            <input type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required />
          </div>
          <button type="submit" style={styles.button}>Register</button>
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
