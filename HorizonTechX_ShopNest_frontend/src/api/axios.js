import axios from 'axios';

/**
 * HorizonTechX ShopNest - Axios Base Client
 * Configured with base URL, timeout, and authentication interceptors.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
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
