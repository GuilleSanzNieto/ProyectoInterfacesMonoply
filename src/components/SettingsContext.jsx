// src/Contexts/SettingsContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [colorBlindMode, setColorBlindMode] = useState(false);
  const [language, setLanguage] = useState('es');

  // Al montar: cargar de localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('settings'));
    if (saved) {
      setDarkMode(saved.darkMode);
      setColorBlindMode(saved.colorBlindMode);
      setLanguage(saved.language);
    }
  }, []);

  // Al cambiar: guardar y aplicar clases en <body>
  useEffect(() => {
    localStorage.setItem(
      'settings',
      JSON.stringify({ darkMode, colorBlindMode, language })
    );
    document.body.classList.toggle('dark-mode', darkMode);
    document.body.classList.toggle('daltonic-mode', colorBlindMode);
  }, [darkMode, colorBlindMode, language]);

  const toggleDark = () => setDarkMode(d => !d);
  const toggleColorBlind = () => setColorBlindMode(d => !d);

  return (
    <SettingsContext.Provider
      value={{ darkMode, toggleDark, colorBlindMode, toggleColorBlind, language, setLanguage }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be inside SettingsProvider');
  return ctx;
};
