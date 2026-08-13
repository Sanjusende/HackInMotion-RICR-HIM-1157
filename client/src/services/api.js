import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000
});

// Request Interceptor: Attach authorization token automatically
api.interceptors.request.use(
  (config) => {
    try {
      const sessionData = JSON.parse(localStorage.getItem('krishimitra-session'));
      const token = sessionData?.accessToken || localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global error & token handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.response?.data?.error || 'An unexpected error occurred';

    if (status === 401) {
      // Clear invalid session on 401 unauthorized
      localStorage.removeItem('krishimitra-session');
      localStorage.removeItem('token');
    }

    console.error(`API Error [${status || 'NETWORK_ERROR'}]:`, message);
    return Promise.reject(error);
  }
);

export default api;
