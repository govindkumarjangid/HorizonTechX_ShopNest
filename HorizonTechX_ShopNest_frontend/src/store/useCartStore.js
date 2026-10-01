import { create } from 'zustand';
import { cartApi } from '../api/cartApi';

const CART_STORAGE_KEY = 'shopnest_cart_items';

const getInitialItems = () => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveItems = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch { }
};


export const useCartStore = create((set, get) => ({
  items: getInitialItems(),
  isDrawerOpen: false,
  isLoading: false,

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  // Add item to cart with normalization
  addItem: (product, quantity = 1) => {
    const resolvedId = product._id || product.id;
    const resolvedTitle = product.name || product.title;
    const resolvedImage = product.image || (product.images && product.images.length > 0 ? product.images[0] : '');
    const resolvedPrice = Number(product.price) || 0;

    const normalizedProduct = {
      ...product,
      id: resolvedId,
      _id: resolvedId,
      title: resolvedTitle,
      name: resolvedTitle,
      image: resolvedImage,
      price: resolvedPrice,
    };

    set((state) => {
      const existingIndex = state.items.findIndex(
        (item) => (item._id || item.id) === resolvedId
      );

      let nextItems;
      if (existingIndex > -1) {
        nextItems = state.items.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: (item.quantity || 1) + quantity }
            : item
        );
      } else {
        nextItems = [...state.items, { ...normalizedProduct, quantity }];
      }

      saveItems(nextItems);
      return { items: nextItems };
    });

    // Sync to backend if token is available
    const token = localStorage.getItem('shopnest_token');
    if (token) {
      cartApi.addToCart(resolvedId, quantity).catch((err) => {
        console.warn('[useCartStore] Backend cart sync failed:', err.message);
      });
    }
  },

  // Update quantity of a product in cart
  updateQuantity: (productId, quantity) => {
    const resolvedId = typeof productId === 'object' ? (productId._id || productId.id) : productId;

    if (quantity <= 0) {
      get().removeItem(resolvedId);
      return;
    }

    set((state) => {
      const nextItems = state.items.map((item) =>
        (item._id || item.id) === resolvedId ? { ...item, quantity } : item
      );
      saveItems(nextItems);
      return { items: nextItems };
    });

    const token = localStorage.getItem('shopnest_token');
    if (token) {
      cartApi.updateQuantity(resolvedId, quantity).catch(() => { });
    }
  },

  // Remove item from cart
  removeItem: (productId) => {
    const resolvedId = typeof productId === 'object' ? (productId._id || productId.id) : productId;

    set((state) => {
      const nextItems = state.items.filter((item) => (item._id || item.id) !== resolvedId);
      saveItems(nextItems);
      return { items: nextItems };
    });

    const token = localStorage.getItem('shopnest_token');
    if (token) {
      cartApi.removeFromCart(resolvedId).catch(() => { });
    }
  },

  // Clear all items in cart
  clearCart: () => {
    saveItems([]);
    set({ items: [] });

    const token = localStorage.getItem('shopnest_token');
    if (token)
      cartApi.clearCart().catch(() => { });
  },

  // Fetch and sync cart with backend server
  fetchCart: async () => {
    const token = localStorage.getItem('shopnest_token');
    if (!token) return;

    set({ isLoading: true });
    try {
      const response = await cartApi.getCart();
      const serverCart = response?.data;
      if (serverCart && Array.isArray(serverCart.items)) {
        const mappedItems = serverCart.items
          .filter((entry) => entry && entry.product)
          .map((entry, idx) => {
            const prod = entry.product || {};
            const resolvedId = prod._id || prod.id || entry._id || `cart-item-${idx}`;
            const resolvedTitle = prod.name || prod.title || 'Curated Hardware';
            const resolvedImage = prod.image || prod.thumbnail || (prod.images && prod.images[0]) || '';
            const resolvedPrice = Number(prod.price || entry.price) || 0;

            return {
              ...prod,
              id: resolvedId,
              _id: resolvedId,
              title: resolvedTitle,
              name: resolvedTitle,
              price: resolvedPrice,
              quantity: Math.max(1, parseInt(entry.quantity, 10) || 1),
              image: resolvedImage,
              category: prod.category || 'Hardware',
            };
          });

        saveItems(mappedItems);
        set({ items: mappedItems, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  // Computed values
  getCartCount: () => {
    return get().items.reduce((total, item) => total + (item.quantity || 1), 0);
  },

  getSubtotal: () => {
    return get().items.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
      0
    );
  },

  getShippingFee: () => {
    const subtotal = get().getSubtotal();
    return subtotal >= 999 || subtotal === 0 ? 0 : 40;
  },

  getTax: () => {
    return Math.round(get().getSubtotal() * 0.18); // 18% GST
  },

  getTotal: () => {
    return get().getSubtotal() + get().getShippingFee() + get().getTax();
  },
}));

export default useCartStore;
