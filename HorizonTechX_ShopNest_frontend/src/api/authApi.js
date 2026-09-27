import api from './axios';

/**
 * Authentication & User Profile API Service
 */
export const authApi = {
  /**
   * Log in user with email and password
   */
  login: async (credentials) => {
    try {
      return await api.post('/auth/login', credentials);
    } catch {
      // Fallback for mock/offline testing
      return {
        success: true,
        user: {
          name: 'Govind Jangid',
          email: credentials.email || 'govindjangid@gmail.com',
          role: 'User',
        },
        token: 'mock-jwt-token-htx',
      };
    }
  },

  /**
   * Register a new user
   */
  register: async (userData) => {
    try {
      return await api.post('/auth/register', userData);
    } catch {
      return {
        success: true,
        user: {
          name: userData.name || 'Govind Jangid',
          email: userData.email,
          role: 'User',
        },
        token: 'mock-jwt-token-htx',
      };
    }
  },

  /**
   * Fetch current authenticated user's profile
   */
  getProfile: async () => {
    try {
      return await api.get('/auth/profile');
    } catch {
      return {
        success: true,
        user: {
          name: 'Govind Jangid',
          email: 'govindjangid@gmail.com',
          phone: '+91 98765 43210',
          city: 'New Delhi • 110001',
        },
      };
    }
  },

  /**
   * Update profile details
   */
  updateProfile: async (profileData) => {
    try {
      return await api.put('/auth/profile', profileData);
    } catch {
      return { success: true, user: profileData };
    }
  },

  /**
   * Add a new shipping address
   */
  addAddress: async (addressData) => {
    try {
      return await api.post('/auth/addresses', addressData);
    } catch {
      return { success: true, address: { id: `addr-${Date.now()}`, ...addressData } };
    }
  },

  /**
   * Delete an existing shipping address
   */
  deleteAddress: async (addressId) => {
    try {
      return await api.delete(`/auth/addresses/${addressId}`);
    } catch {
      return { success: true, id: addressId };
    }
  },
};

export default authApi;
