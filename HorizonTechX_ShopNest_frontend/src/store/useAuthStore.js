import { create } from 'zustand';
import { authApi } from '../api/authApi';
import { useProductStore } from './useProductStore';

const WISHLIST_STORAGE_KEY = 'shopnest_wishlist_items';

const getInitialWishlist = () => {
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveWishlist = (items) => {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch { }
};

export const matchWishlistId = (itemA, itemB) => {
  if (!itemA || !itemB) return false;
  const idA = typeof itemA === 'object' ? (itemA._id || itemA.id) : itemA;
  const idB = typeof itemB === 'object' ? (itemB._id || itemB.id) : itemB;
  if (idA === undefined || idA === null || idB === undefined || idB === null) return false;
  return String(idA) === String(idB);
};

export const normalizeWishlistItem = (item) => {
  if (!item) return null;
  const resolvedId = typeof item === 'object' ? (item._id || item.id) : item;
  const resolvedTitle = typeof item === 'object' ? (item.name || item.title || 'Curated Piece') : 'Curated Piece';
  const resolvedImage = typeof item === 'object' ? (item.image || (item.images && item.images[0]) || '') : '';
  const resolvedPrice = typeof item === 'object' ? (Number(item.price) || 0) : 0;
  const resolvedCategory = typeof item === 'object' ? (item.category || 'General') : 'General';
  const resolvedInStock = typeof item === 'object' ? (item.inStock !== undefined ? item.inStock : (item.stock > 0)) : true;

  return {
    ...(typeof item === 'object' ? item : {}),
    id: resolvedId,
    _id: resolvedId,
    title: resolvedTitle,
    name: resolvedTitle,
    image: resolvedImage,
    price: resolvedPrice,
    category: resolvedCategory,
    inStock: resolvedInStock,
  };
};

export const useAuthStore = create((set, get) => ({
  isAuthenticated: !!localStorage.getItem('shopnest_token'),
  token: localStorage.getItem('shopnest_token') || null,
  user: null,
  savedAddresses: [],
  wishlist: getInitialWishlist(),
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
        const rawWishlist = userData.wishlist || [];
        const normalizedWishlist = rawWishlist.map(normalizeWishlistItem).filter(Boolean);
        const effectiveWishlist = normalizedWishlist.length > 0 ? normalizedWishlist : getInitialWishlist();
        saveWishlist(effectiveWishlist);

        set({
          isAuthenticated: true,
          user: userData,
          savedAddresses: userData.addresses || [],
          wishlist: effectiveWishlist,
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
        const rawWishlist = user?.wishlist || [];
        const normalizedWishlist = rawWishlist.map(normalizeWishlistItem).filter(Boolean);
        const effectiveWishlist = normalizedWishlist.length > 0 ? normalizedWishlist : getInitialWishlist();
        saveWishlist(effectiveWishlist);

        set({
          isAuthenticated: true,
          token: accessToken,
          user,
          savedAddresses: user?.addresses || [],
          wishlist: effectiveWishlist,
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
        const rawWishlist = user?.wishlist || [];
        const normalizedWishlist = rawWishlist.map(normalizeWishlistItem).filter(Boolean);
        const effectiveWishlist = normalizedWishlist.length > 0 ? normalizedWishlist : getInitialWishlist();
        saveWishlist(effectiveWishlist);

        set({
          isAuthenticated: true,
          token: accessToken,
          user,
          savedAddresses: user?.addresses || [],
          wishlist: effectiveWishlist,
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
    localStorage.removeItem(WISHLIST_STORAGE_KEY);
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
  toggleWishlist: async (productOrId) => {
    if (!productOrId) return;
    const targetId = typeof productOrId === 'object' ? (productOrId._id || productOrId.id) : productOrId;
    if (!targetId) return;

    const currentWishlist = get().wishlist || [];
    const exists = currentWishlist.some((item) => matchWishlistId(item, targetId));

    let nextWishlist;
    if (exists) {
      nextWishlist = currentWishlist.filter((item) => !matchWishlistId(item, targetId));
    } else {
      let fullProduct = typeof productOrId === 'object' && (productOrId.title || productOrId.name || productOrId.image || productOrId.price !== undefined) ? productOrId : null;
      if (!fullProduct) {
        try {
          const storeProducts = useProductStore.getState().products;
          fullProduct = storeProducts.find((p) => matchWishlistId(p, targetId));
        } catch { }
      }
      const itemToSave = fullProduct
        ? normalizeWishlistItem(fullProduct)
        : { id: targetId, _id: targetId, title: 'Curated Piece', name: 'Curated Piece', price: 0, image: '' };
      nextWishlist = [...currentWishlist, itemToSave];
    }

    saveWishlist(nextWishlist);
    set({ wishlist: nextWishlist });

    if (get().isAuthenticated) {
      try {
        const response = await authApi.toggleWishlist(targetId);
        const serverWishlist = response?.data || response?.wishlist;
        if (Array.isArray(serverWishlist)) {
          const normalized = serverWishlist.map(normalizeWishlistItem).filter(Boolean);
          saveWishlist(normalized);
          set({ wishlist: normalized });
        }
      } catch (err) {
        console.warn('[useAuthStore] toggleWishlist sync error:', err.message);
      }
    }
  },

  isInWishlist: (productId) => {
    if (!productId) return false;
    return (get().wishlist || []).some((item) => matchWishlistId(item, productId));
  },
}));

export default useAuthStore;
