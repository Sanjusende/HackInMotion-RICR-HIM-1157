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

// Response Interceptor: Global error & token refresh handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.message || error.response?.data?.error || 'An unexpected error occurred';

    // Automatic token refresh retry for 401 Unauthorized
    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const sessionData = JSON.parse(localStorage.getItem('krishimitra-session'));
        if (sessionData?.refreshToken) {
          const refreshRes = await axios.post(`${baseURL}/auth/refresh-token`, {
            refreshToken: sessionData.refreshToken
          });

          if (refreshRes.data?.success && refreshRes.data?.data?.accessToken) {
            const newAccessToken = refreshRes.data.data.accessToken;
            const newRefreshToken = refreshRes.data.data.refreshToken || sessionData.refreshToken;

            const updatedSession = {
              ...sessionData,
              accessToken: newAccessToken,
              refreshToken: newRefreshToken
            };
            localStorage.setItem('krishimitra-session', JSON.stringify(updatedSession));
            localStorage.setItem('token', newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          }
        }
      } catch (refreshErr) {
        localStorage.removeItem('krishimitra-session');
        localStorage.removeItem('token');
      }
    }

    if (status === 401) {
      localStorage.removeItem('krishimitra-session');
      localStorage.removeItem('token');
    }

    console.error(`API Error [${status || 'NETWORK_ERROR'}]:`, message);
    return Promise.reject(error);
  }
);

export default api;
