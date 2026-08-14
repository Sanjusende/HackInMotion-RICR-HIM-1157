import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { loginUser, registerUser, getProfile, logoutUser } from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  language: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isProfileComplete: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_KEY = 'km_access_token';
const REFRESH_TOKEN_KEY = 'km_refresh_token';
const USER_KEY = 'km_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // Helper for Secure Store (with web fallback)
  const saveSecureItem = async (key: string, value: string) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (e) {
      console.error('SecureStore Save Error:', e);
    }
  };

  const getSecureItem = async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (e) {
      console.error('SecureStore Get Error:', e);
      return null;
    }
  };

  const removeSecureItem = async (key: string) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (e) {
      console.error('SecureStore Delete Error:', e);
    }
  };

  // Perform checks on app start
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const savedToken = await getSecureItem(ACCESS_TOKEN_KEY);
      const savedUserStr = await getSecureItem(USER_KEY);
      
      if (savedToken && savedUserStr) {
        setToken(savedToken);
        const parsedUser = JSON.parse(savedUserStr);
        setUser(parsedUser);
        
        // Fetch current verification profile
        const profileRes = await getProfile(savedToken);
        if (profileRes?.success) {
          setIsProfileComplete(profileRes.profileComplete !== false);
        }
      }
    } catch (e) {
      console.error('Auto login verification failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await loginUser(email, password);
      if (res?.success && res.data) {
        const { accessToken, refreshToken, user: userData } = res.data;
        
        await saveSecureItem(ACCESS_TOKEN_KEY, accessToken);
        await saveSecureItem(REFRESH_TOKEN_KEY, refreshToken);
        await saveSecureItem(USER_KEY, JSON.stringify(userData));
        
        setToken(accessToken);
        setUser(userData);
        
        // Check profile complete status
        const profileRes = await getProfile(accessToken);
        if (profileRes?.success) {
          setIsProfileComplete(profileRes.profileComplete !== false);
        }
      } else {
        throw new Error(res?.message || 'Login failed');
      }
    } catch (e) {
      setIsLoading(false);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, phone: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await registerUser(name, email, phone, password);
      if (res?.success && res.data) {
        const { accessToken, refreshToken, user: userData } = res.data;
        
        await saveSecureItem(ACCESS_TOKEN_KEY, accessToken);
        await saveSecureItem(REFRESH_TOKEN_KEY, refreshToken);
        await saveSecureItem(USER_KEY, JSON.stringify(userData));
        
        setToken(accessToken);
        setUser(userData);
        setIsProfileComplete(false); // New signup has incomplete profile by default
      } else {
        throw new Error(res?.message || 'Registration failed');
      }
    } catch (e) {
      setIsLoading(false);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const activeRefreshToken = await getSecureItem(REFRESH_TOKEN_KEY);
      if (activeRefreshToken) {
        await logoutUser(activeRefreshToken);
      }
    } catch (e) {
      console.warn('Logout call to backend returned error:', e);
    } finally {
      await removeSecureItem(ACCESS_TOKEN_KEY);
      await removeSecureItem(REFRESH_TOKEN_KEY);
      await removeSecureItem(USER_KEY);
      setToken(null);
      setUser(null);
      setIsProfileComplete(false);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        isProfileComplete,
        login,
        signup,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
