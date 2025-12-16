import React, { createContext, useState, useContext } from 'react';

const SettingsContext = createContext();

// Exchange rates against a base currency (e.g., USD)
const exchangeRates = {
  USD: 1,
  SLE: 25, // Example rate: 1 USD = 25 SLE (new Leone)
  EUR: 0.92,
  GBP: 0.79,
};

const currencySymbols = {
  USD: '$',
  SLE: 'Le',
  EUR: '€',
  GBP: '£',
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    language: 'en',
    currency: 'SLE', // Default to Sierra Leonean Leone
  });

  const convertPrice = (priceInBase) => {
    const rate = exchangeRates[settings.currency] || 1;
    const symbol = currencySymbols[settings.currency] || '$';
    const converted = priceInBase * rate;

    // Format SLE as an integer with the symbol first
    if (settings.currency === 'SLE') {
      return `${symbol}${Math.round(converted).toLocaleString()}`;
    }

    return `${symbol}${converted.toFixed(2)}`;
  };

  const value = { settings, setSettings, convertPrice };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => useContext(SettingsContext);