import axios from 'axios';

/**
 * HorizonTechX ShopNest - Axios Base Client
 * Configured with base URL, timeout, and authentication interceptors.
 */
const LIVE_BACKEND_URL = 'https://horizontechx-shopnest.onrender.com/api';

const resolveBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  // If in production build, guard against accidental localhost leaks
  if (import.meta.env.PROD) {
    if (!envUrl || envUrl.includes('localhost') || envUrl.includes('127.0.0.1')) {
      return LIVE_BACKEND_URL;
    }
    return envUrl;
  }
  return envUrl || 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: resolveBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach Auth Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shopnest_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Standardized Error Handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred.';

    console.warn('[API Error]:', {
      status: error.response?.status,
      message,
      url: error.config?.url,
    });

    return Promise.reject({
      status: error.response?.status,
      message,
      data: error.response?.data,
    });
  }
);

export default api;
