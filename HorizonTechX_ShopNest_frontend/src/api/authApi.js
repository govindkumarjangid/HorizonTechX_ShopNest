import api from './axios';

/**
 * Authentication & User Profile API Service (Real Backend)
 * Zero mock fallbacks: Direct integration with JWT authentication & MongoDB user collection.
 */
export const authApi = {
  /**
   * Log in user with email and password
   */
  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },

  /**
   * Register a new user
   */
  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  /**
   * Log out authenticated user
   */
  logout: async () => {
    return await api.post('/auth/logout');
  },

  /**
   * Fetch current authenticated user's profile
   */
  getProfile: async () => {
    return await api.get('/auth/me');
  },

  /**
   * Update profile details
   */
  updateProfile: async (profileData) => {
    return await api.put('/auth/me', profileData);
  },

  /**
   * Add a new shipping address
   */
  addAddress: async (addressData) => {
    return await api.post('/auth/addresses', addressData);
  },

  /**
   * Delete an existing shipping address
   */
  deleteAddress: async (addressId) => {
    return await api.delete(`/auth/addresses/${addressId}`);
  },

  /**
   * Set address as default
   */
  setDefaultAddress: async (addressId) => {
    return await api.patch(`/auth/addresses/${addressId}/default`);
  },

  /**
   * Toggle item in user's wishlist
   */
  toggleWishlist: async (productId) => {
    return await api.post(`/auth/wishlist/${productId}`);
  },
};

export default authApi;
