import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

// Create the context that components will consume
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // On initial app load, try to load user from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('userInfo');
      if (stored) {
        setUserInfo(JSON.parse(stored));
      }
    } catch (err) {
      // If parsing fails, clear the broken item
      localStorage.removeItem('userInfo');
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      // The 'data' object itself is the user info payload from the backend.
      const { data } = await api.post('/users/login', { email, password });

      localStorage.setItem('userInfo', JSON.stringify(data));
      setUserInfo(data);

      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'An unexpected error occurred. Please try again.';
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
  };

  const updateUserInfo = (newInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(newInfo));
    setUserInfo(newInfo);
  };

  return (
    <AuthContext.Provider
      value={{ userInfo, loading, login, logout, updateUserInfo }} // Ensure updateUserInfo is exported
    >
      {children}
    </AuthContext.Provider>
  );
};
