import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import theme from '../theme/theme';

// ------------------------------------------------------
// Constants
// ------------------------------------------------------

const THEME_STORAGE_KEY = 'km-theme-mode';

const THEME_MODES = Object.freeze({
  LIGHT: 'light',
  DARK: 'dark',
});

// ------------------------------------------------------
// Theme Context
// ------------------------------------------------------

const ThemeContext = createContext(null);

// ------------------------------------------------------
// Get Initial Theme Mode
// ------------------------------------------------------

const getInitialMode = () => {
  try {
    const savedMode = localStorage.getItem(THEME_STORAGE_KEY);

    if (savedMode === THEME_MODES.LIGHT || savedMode === THEME_MODES.DARK) {
      return savedMode;
    }
  } catch (error) {
    console.warn('[Theme] Unable to read saved theme:', error);
  }

  return THEME_MODES.LIGHT;
};

// ------------------------------------------------------
// Theme Provider
// ------------------------------------------------------

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(getInitialMode);

  // ------------------------------------------
  // Apply Theme Mode
  // ------------------------------------------

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle('dark', mode === THEME_MODES.DARK);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.warn('[Theme] Unable to save theme preference:', error);
    }
  }, [mode]);

  // ------------------------------------------
  // Toggle Theme
  // ------------------------------------------

  const toggleMode = () => {
    setMode((previousMode) =>
      previousMode === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT
    );
  };

  // ------------------------------------------
  // Context Value
  // ------------------------------------------

  const value = useMemo(
    () => ({
      theme,
      mode,
      isDark: mode === THEME_MODES.DARK,
      toggleMode,
      setMode,
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// ------------------------------------------------------
// useTheme Hook
// ------------------------------------------------------

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider.');
  }

  return context;
};

export default ThemeContext;
