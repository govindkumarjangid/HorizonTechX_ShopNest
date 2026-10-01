import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use((request) => {
  const token = localStorage.getItem('shopnest_token');
  if (token && request.headers)
    request.headers.Authorization = `Bearer ${token}`;
  return request;
},
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use((response) => {
  return response.data;
},
  (error) => {
    const message =
      error.response?.data?.message ||
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
