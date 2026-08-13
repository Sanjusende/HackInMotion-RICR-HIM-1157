import React, { createContext, useContext, useState, useEffect } from 'react';
import theme from '../theme/theme';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [mode, setMode] = useState(() => localStorage.getItem('km-theme-mode') || 'light');

  useEffect(() => {
    localStorage.setItem('km-theme-mode', mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const value = {
    theme: currentTheme,
    mode,
    isDark: mode === 'dark',
    toggleMode,
    setMode
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
