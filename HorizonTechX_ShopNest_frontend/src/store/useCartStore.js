import { create } from 'zustand';
import { products } from '../assets/assets';

/**
 * Zustand Cart Store
 * Handles cart item state, quantity updates, item removals,
 * subtotal, shipping, and tax calculations in INR.
 */
export const useCartStore = create((set, get) => ({
  items: [
    { ...products[0], quantity: 1 },
    { ...products[1], quantity: 1 },
  ],
  isDrawerOpen: false,

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: (item.quantity || 1) + quantity }
              : item
          ),
          isDrawerOpen: true,
        };
      }
      return {
        items: [...state.items, { ...product, quantity }],
        isDrawerOpen: true,
      };
    });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      ),
    }));
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }));
  },

  clearCart: () => set({ items: [] }),

  // Computed values
  getCartCount: () => {
    return get().items.reduce((total, item) => total + (item.quantity || 1), 0);
  },

  getSubtotal: () => {
    return get().items.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
  },

  getShippingFee: () => {
    const subtotal = get().getSubtotal();
    return subtotal >= 4999 || subtotal === 0 ? 0 : 499;
  },

  getTax: () => {
    return get().getSubtotal() * 0.18; // 18% GST
  },

  getTotal: () => {
    return get().getSubtotal() + get().getShippingFee() + get().getTax();
  },
}));

export default useCartStore;
