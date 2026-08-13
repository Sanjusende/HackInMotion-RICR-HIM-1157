import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api/v1', timeout: 10000 });

// Add request interceptor to automatically attach authorization header
api.interceptors.request.use(
  (config) => {
    try {
      const sessionData = JSON.parse(localStorage.getItem('krishimitra-session'));
      if (sessionData?.accessToken) {
        config.headers.Authorization = `Bearer ${sessionData.accessToken}`;
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const storedSession = () => {
  try {
    return JSON.parse(localStorage.getItem('krishimitra-session')) || null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(storedSession);
  const [isReady, setIsReady] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (session) {
      localStorage.setItem('krishimitra-session', JSON.stringify(session));
      setCurrentUser(session.user);
    } else {
      localStorage.removeItem('krishimitra-session');
      setCurrentUser(null);
    }
  }, [session]);

  const fetchCurrentUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      if (data.success && data.data.user) {
        setCurrentUser(data.data.user);
        setSession((prev) => prev ? { ...prev, user: data.data.user } : null);
        return data.data.user;
      }
    } catch (err) {
      // Token might be invalid or expired. Clear session.
      setSession(null);
    }
    return null;
  };

  useEffect(() => {
    const initAuth = async () => {
      if (session?.accessToken) {
        await fetchCurrentUser();
      }
      setLoadingUser(false);
      setIsReady(true);
    };
    initAuth();
  }, []);

  const saveSession = (data) => {
    const next = { user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken };
    setSession(next);
    return next.user;
  };

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    if (!data.success) throw new Error(data.message || 'Unable to sign in');
    saveSession(data.data);
    return { user: data.data.user };
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    if (!data.success) throw new Error(data.message || 'Unable to create account');
    saveSession(data.data);
    return { user: data.data.user };
  };

  const logout = async () => {
    try {
      if (session?.refreshToken) {
        await api.post('/auth/logout', { refreshToken: session.refreshToken });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setSession(null);
      setCurrentUser(null);
      localStorage.removeItem('krishimitra-session');
      
      // Clear cookies
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
    }
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  const checkProfile = async () => {
    return true; // MVP fallback
  };

  const value = {
    // Legacy support
    user: currentUser,
    isReady,
    // Required properties
    isAuthenticated: !!currentUser,
    currentUser,
    profileCompleted: true, // Auto completed in minimal auth MVP
    loading: !isReady || loadingUser,
    // Functions
    login,
    register,
    logout,
    refreshUser,
    checkProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
