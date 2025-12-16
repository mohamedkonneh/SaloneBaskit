import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Load theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    // Update localStorage and apply class to body
    localStorage.setItem('theme', theme);
    document.body.className = ''; // Clear existing theme classes
    document.body.classList.add(theme); // Add the current theme class
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const themeStyles = {
    light: {
      background: '#ffffff',
      text: '#212529',
      cardBg: '#f8f9fa',
    },
    dark: {
      background: '#121212',
      text: '#e9ecef',
      cardBg: '#1e1e1e',
    },
  };

  const value = { theme, toggleTheme, styles: themeStyles[theme] };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);