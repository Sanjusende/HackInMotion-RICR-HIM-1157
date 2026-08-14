import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const BACKEND_URL = 'https://hackinmotion-ricr-him-1157-1.onrender.com/api/v1';

const ACCESS_TOKEN_KEY = 'km_access_token';
const REFRESH_TOKEN_KEY = 'km_refresh_token';
const USER_KEY = 'km_user';

const getSecureToken = async (key: string): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch {
    return null;
  }
};

const saveSecureToken = async (key: string, value: string) => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (e) {
    console.error('Storage error:', e);
  }
};

const removeSecureTokens = async () => {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } else {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    }
  } catch {}
};

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 20000,
});

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await getSecureToken(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const storedRefreshToken = await getSecureToken(REFRESH_TOKEN_KEY);
        if (storedRefreshToken) {
          const refreshRes = await axios.post(`${BACKEND_URL}/auth/refresh-token`, {
            refreshToken: storedRefreshToken,
          });

          if (refreshRes.data?.success && refreshRes.data?.data?.accessToken) {
            const newAccessToken = refreshRes.data.data.accessToken;
            const newRefreshToken = refreshRes.data.data.refreshToken || storedRefreshToken;

            await saveSecureToken(ACCESS_TOKEN_KEY, newAccessToken);
            await saveSecureToken(REFRESH_TOKEN_KEY, newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          }
        }
      } catch (refreshErr) {
        await removeSecureTokens();
      }
    }

    if (status === 401) {
      await removeSecureTokens();
    }

    return Promise.reject(error);
  }
);

export default api;
