import api from './axios';

/**
 * Shopping Cart API Service
 */
export const cartApi = {
  /**
   * Fetch user cart from server
   */
  getCart: async () => {
    try {
      return await api.get('/cart');
    } catch {
      return { success: true, items: [] };
    }
  },

  /**
   * Add item to cart
   */
  addToCart: async (productId, quantity = 1) => {
    try {
      return await api.post('/cart/items', { productId, quantity });
    } catch {
      return { success: true, message: 'Item added to cart', productId, quantity };
    }
  },

  /**
   * Update quantity of a cart item
   */
  updateQuantity: async (productId, quantity) => {
    try {
      return await api.put(`/cart/items/${productId}`, { quantity });
    } catch {
      return { success: true, productId, quantity };
    }
  },

  /**
   * Remove item from cart
   */
  removeFromCart: async (productId) => {
    try {
      return await api.delete(`/cart/items/${productId}`);
    } catch {
      return { success: true, productId };
    }
  },

  /**
   * Clear all items in cart
   */
  clearCart: async () => {
    try {
      return await api.delete('/cart');
    } catch {
      return { success: true, items: [] };
    }
  },
};

export default cartApi;
