import api from './axios';

/**
 * Shopping Cart API Service (Real Backend)
 * Zero mock fallbacks: Direct integration with MongoDB Cart collection.
 */
export const cartApi = {
  /**
   * Fetch authenticated user's cart from server
   */
  getCart: async () => {
    return await api.get('/cart');
  },

  /**
   * Add item to cart
   */
  addToCart: async (productId, quantity = 1) => {
    return await api.post('/cart/items', { productId, quantity });
  },

  /**
   * Update quantity of a cart item
   */
  updateQuantity: async (productId, quantity) => {
    return await api.put('/cart/items', { productId, quantity });
  },

  /**
   * Remove item from cart
   */
  removeFromCart: async (productId) => {
    return await api.delete(`/cart/items/${productId}`);
  },

  /**
   * Clear all items in cart
   */
  clearCart: async () => {
    return await api.delete('/cart');
  },
};

export default cartApi;
