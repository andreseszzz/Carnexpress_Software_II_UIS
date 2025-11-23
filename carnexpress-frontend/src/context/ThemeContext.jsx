import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Cargar preferencia desde localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setDarkMode(savedTheme === 'true');
    }
  }, []);

  // Guardar preferencia en localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.body.style.backgroundColor = darkMode ? '#1a1a1a' : '#2c3e50';
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const theme = {
    darkMode,
    toggleTheme,
    colors: {
      background: darkMode ? '#1a1a1a' : '#2c3e50',
      surface: darkMode ? '#2d2d2d' : 'white',
      text: darkMode ? '#ffffff' : '#333333',
      textSecondary: darkMode ? '#b0b0b0' : '#666666',
      primary: '#dc3545',
      success: '#28a745',
      warning: '#ffc107',
      info: '#17a2b8',
      border: darkMode ? '#404040' : '#ddd',
      hover: darkMode ? '#3a3a3a' : '#f5f5f5'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
