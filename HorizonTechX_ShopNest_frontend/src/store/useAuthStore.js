import { create } from 'zustand';
import { authApi } from '../api/authApi';

export const useAuthStore = create((set, get) => ({
  isAuthenticated: !!localStorage.getItem('shopnest_token'),
  token: localStorage.getItem('shopnest_token') || null,
  user: null,
  savedAddresses: [],
  wishlist: [],
  isLoading: false,
  isInitialized: false,

  // Initialize session on app load from stored JWT
  initAuth: async () => {
    const token = localStorage.getItem('shopnest_token');
    if (!token) {
      set({ isInitialized: true, isAuthenticated: false, user: null });
      return;
    }

    set({ isLoading: true });
    try {
      const response = await authApi.getProfile();
      const userData = response?.data || null;

      if (userData) {
        set({
          isAuthenticated: true,
          user: userData,
          savedAddresses: userData.addresses || [],
          wishlist: userData.wishlist || [],
          isLoading: false,
          isInitialized: true,
        });
      } else {
        localStorage.removeItem('shopnest_token');
        set({ isAuthenticated: false, user: null, token: null, isLoading: false, isInitialized: true });
      }
    } catch (err) {
      console.warn('[useAuthStore] Token verification failed:', err.message);
      localStorage.removeItem('shopnest_token');
      set({ isAuthenticated: false, user: null, token: null, isLoading: false, isInitialized: true });
    }
  },

  // Real login with email and password
  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login(credentials);
      const { user, accessToken } = response?.data || {};

      if (accessToken) {
        localStorage.setItem('shopnest_token', accessToken);
        set({
          isAuthenticated: true,
          token: accessToken,
          user,
          savedAddresses: user?.addresses || [],
          wishlist: user?.wishlist || [],
          isLoading: false,
        });
        return { success: true, user };
      }
      throw new Error(response?.message || 'Login failed');
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  // Real user registration
  register: async (userData) => {
    set({ isLoading: true });
    try {
      const response = await authApi.register(userData);
      const { user, accessToken } = response?.data || {};

      if (accessToken) {
        localStorage.setItem('shopnest_token', accessToken);
        set({
          isAuthenticated: true,
          token: accessToken,
          user,
          savedAddresses: user?.addresses || [],
          wishlist: user?.wishlist || [],
          isLoading: false,
        });
        return { success: true, user };
      }
      throw new Error(response?.message || 'Registration failed');
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  //  Logout user and clear session
  logout: async () => {
    try {
      await authApi.logout();
    } catch { }
    localStorage.removeItem('shopnest_token');
    set({
      isAuthenticated: false,
      token: null,
      user: null,
      savedAddresses: [],
      wishlist: [],
    });
  },

  // Update profile details
  updateProfile: async (updatedData) => {
    set({ isLoading: true });
    try {
      const response = await authApi.updateProfile(updatedData);
      const updatedUser = response?.data;
      if (updatedUser) {
        set((state) => ({
          user: { ...state.user, ...updatedUser },
          isLoading: false,
        }));
      }
      return updatedUser;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  // Add a new shipping address
  addAddress: async (newAddress) => {
    try {
      const response = await authApi.addAddress(newAddress);
      const updatedAddresses = response?.data?.addresses || response?.data;

      if (Array.isArray(updatedAddresses)) {
        set({ savedAddresses: updatedAddresses });
      } else {
        set((state) => ({
          savedAddresses: [...state.savedAddresses, response?.data || newAddress],
        }));
      }
      return response?.data;
    } catch (err) {
      throw err;
    }
  },

  // Delete an existing shipping address
  deleteAddress: async (addressId) => {
    try {
      await authApi.deleteAddress(addressId);
      set((state) => ({
        savedAddresses: state.savedAddresses.filter((a) => (a._id || a.id) !== addressId),
      }));
    } catch (err) {
      throw err;
    }
  },

  // Set default shipping address
  setDefaultAddress: async (addressId) => {
    try {
      await authApi.setDefaultAddress(addressId);
      set((state) => ({
        savedAddresses: state.savedAddresses.map((a) => ({
          ...a,
          isDefault: (a._id || a.id) === addressId,
        })),
      }));
    } catch (err) {
      throw err;
    }
  },

  // Toggle item in wishlist
  toggleWishlist: async (productId) => {
    const id = typeof productId === 'object' ? (productId._id || productId.id) : productId;

    // Optimistic update
    set((state) => {
      const exists = state.wishlist.includes(id);
      return {
        wishlist: exists
          ? state.wishlist.filter((item) => item !== id)
          : [...state.wishlist, id],
      };
    });

    if (get().isAuthenticated) {
      try {
        await authApi.toggleWishlist(id);
      } catch (err) {
        console.warn('[useAuthStore] toggleWishlist sync error:', err.message);
      }
    }
  },

  isInWishlist: (productId) => {
    const id = typeof productId === 'object' ? (productId._id || productId.id) : productId;
    return get().wishlist.includes(id);
  },
}));

export default useAuthStore;
