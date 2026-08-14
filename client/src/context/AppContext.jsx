import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [language, setLanguage] = useState('EN');

  const addNotification = (notif) => {
    const id = Date.now();
    setNotifications((prev) => [{ id, createdAt: new Date(), ...notif }, ...prev]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    globalLoading,
    setGlobalLoading,
    language,
    setLanguage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
