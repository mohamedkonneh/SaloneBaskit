import React, { createContext, useState, useContext, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('appSettings');
      // Default settings if nothing is saved
      return savedSettings ? JSON.parse(savedSettings) : { language: 'en', currency: 'USD' };
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
      return { language: 'en', currency: 'USD' };
    }
  });

  useEffect(() => {
    // Save settings to localStorage whenever they change
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  const value = {
    settings,
    setSettings, // Provide the setter function to update settings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};