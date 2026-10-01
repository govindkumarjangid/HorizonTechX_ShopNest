import api from './axios';

export const authApi = {
  // login user
  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },

  // register new user
  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  // logout user
  logout: async () => {
    return await api.post('/auth/logout');
  },

  // fetch user profile
  getProfile: async () => {
    return await api.get('/auth/me');
  },

  // Update profile details
  updateProfile: async (profileData) => {
    return await api.put('/auth/me', profileData);
  },

  // Add a new shipping address
  addAddress: async (addressData) => {
    return await api.post('/auth/addresses', addressData);
  },

  // Fetch all shipping addresses
  deleteAddress: async (addressId) => {
    return await api.delete(`/auth/addresses/${addressId}`);
  },

  // Fetch all shipping addresses
  setDefaultAddress: async (addressId) => {
    return await api.patch(`/auth/addresses/${addressId}/default`);
  },

  // toggle wishlist for a product
  toggleWishlist: async (productId) => {
    return await api.post(`/auth/wishlist/${productId}`);
  },
};

export default authApi;
