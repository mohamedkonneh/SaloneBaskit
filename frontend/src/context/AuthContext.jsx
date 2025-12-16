import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axiosConfig';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial auth check

  useEffect(() => {
    // Check for user data in localStorage when the app loads
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false); // Finished checking auth state
  }, []);

  const login = async (email, password) => {
    // The login function now handles the API call itself
    const res = await api.post('/users/login', { email, password });
    const userData = res.data;

    localStorage.setItem('user', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    setUser(userData);
    return userData; // Return user data for conditional redirects
  };

  const logout = () => {
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = { user, login, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};