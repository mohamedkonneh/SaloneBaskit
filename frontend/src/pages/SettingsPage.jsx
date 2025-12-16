import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaLanguage, FaMoneyBillWave, FaMoon, FaSun } from 'react-icons/fa';
import { useSettings } from '../context/SettingsContext'; // Import the custom hook
import { useTheme } from '../context/ThemeContext'; // Import the theme hook

const SettingsPage = () => {
  const { settings: globalSettings, setSettings: setGlobalSettings } = useSettings();
  const { theme, toggleTheme } = useTheme();
  const [localSettings, setLocalSettings] = useState(globalSettings);

  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    // Update the global settings context with the local changes
    setGlobalSettings(localSettings);
    toast.success('Settings saved successfully!');
  };

  return (
    <div>
      <h2 style={styles.title}>Settings</h2>
      <div style={styles.settingsContainer}>
        {/* Language Setting */}
        <div style={styles.settingCard}>
          <div style={styles.cardHeader}>
            <FaLanguage style={styles.icon} />
            <h3 style={styles.cardTitle}>Language</h3>
          </div>
          <p style={styles.cardDescription}>Choose your preferred language for the application.</p>
          <select 
            name="language" 
            value={localSettings.language} 
            onChange={handleSettingChange} 
            style={styles.select}
          >
            <option value="en">English</option>
            <option value="fr">Français (French)</option>
            <option value="es">Español (Spanish)</option>
          </select>
        </div>

        {/* Currency Setting */}
        <div style={styles.settingCard}>
          <div style={styles.cardHeader}>
            <FaMoneyBillWave style={styles.icon} />
            <h3 style={styles.cardTitle}>Currency</h3>
          </div>
          <p style={styles.cardDescription}>Select the currency for displaying prices.</p>
          <select 
            name="currency" 
            value={localSettings.currency} 
            onChange={handleSettingChange} 
            style={styles.select}
          >
            <option value="USD">USD - United States Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="SLE">SLE - Sierra Leonean Leone</option>
            <option value="GBP">GBP - British Pound</option>
          </select>
        </div>

        {/* Theme Setting */}
        <div style={styles.settingCard}>
          <div style={styles.cardHeader}>
            {theme === 'light' ? <FaSun style={styles.icon} /> : <FaMoon style={styles.icon} />}
            <h3 style={styles.cardTitle}>Theme</h3>
          </div>
          <p style={styles.cardDescription}>Switch between light and dark mode.</p>
          <div style={styles.toggleContainer}>
            <span>Light</span>
            <label style={styles.switch}>
              <input type="checkbox" onChange={toggleTheme} checked={theme === 'dark'} />
              <span style={{...styles.slider, ...styles.round}}></span>
            </label>
            <span>Dark</span>
          </div>
        </div>
      </div>
      <div style={styles.actions}>
        <button onClick={handleSaveChanges} style={styles.saveButton}>Save Changes</button>
      </div>
    </div>
  );
};

const styles = {
  title: { marginBottom: '20px', fontSize: '1.8rem' },
  settingsContainer: { display: 'grid', gap: '25px' },
  settingCard: { backgroundColor: '#f8f9fa', padding: '25px', borderRadius: '12px', border: '1px solid #eee' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' },
  icon: { color: '#007bff', fontSize: '1.5rem' },
  cardTitle: { margin: 0, fontSize: '1.2rem' },
  cardDescription: { margin: '0 0 15px 0', color: '#6c757d' },
  select: { width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '1rem' },
  actions: { marginTop: '30px', textAlign: 'right' },
  saveButton: {
    padding: '12px 25px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#28a745',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  // --- Toggle Switch Styles ---
  toggleContainer: { display: 'flex', alignItems: 'center', gap: '10px' },
  switch: { position: 'relative', display: 'inline-block', width: '60px', height: '34px' },
  'switch input': { opacity: 0, width: 0, height: 0 },
  slider: {
    position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#ccc', transition: '.4s',
  },
  'slider:before': {
    position: 'absolute', content: '""', height: '26px', width: '26px',
    left: '4px', bottom: '4px', backgroundColor: 'white', transition: '.4s',
  },
  'input:checked + .slider': { backgroundColor: '#007bff' },
  'input:checked + .slider:before': { transform: 'translateX(26px)' },
  round: { borderRadius: '34px' },
  'round:before': { borderRadius: '50%' },
};

export default SettingsPage;