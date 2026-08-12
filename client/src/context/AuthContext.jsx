import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', timeout: 10000 });

const storedSession = () => {
  try { return JSON.parse(localStorage.getItem('krishimitra-session')) || null; } catch { return null; }
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(storedSession);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => { setIsReady(true); }, []);
  useEffect(() => {
    if (session) localStorage.setItem('krishimitra-session', JSON.stringify(session));
    else localStorage.removeItem('krishimitra-session');
  }, [session]);

  const saveSession = (data) => {
    const next = { user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken };
    setSession(next);
    return next.user;
  };

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    if (!data.success) throw new Error(data.message || 'Unable to sign in');
    return saveSession(data.data);
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    if (!data.success) throw new Error(data.message || 'Unable to create account');
    return saveSession(data.data);
  };

  const logout = async () => {
    try {
      if (session?.refreshToken) await api.post('/auth/logout', { refreshToken: session.refreshToken });
    } finally { setSession(null); localStorage.removeItem('krishimitra-farm-profile'); }
  };

  const value = { user: session?.user || null, isReady, login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
