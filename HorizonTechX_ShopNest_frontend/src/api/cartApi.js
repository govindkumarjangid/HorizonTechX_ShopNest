import api from './axios';

export const cartApi = {
  // Fetch the current user's cart
  getCart: async () => {
    return await api.get('/cart');
  },

  // Add an item to the cart
  addToCart: async (productId, quantity = 1) => {
    return await api.post('/cart/items', { productId, quantity });
  },

  // Update the quantity of an item in the cart
  updateQuantity: async (productId, quantity) => {
    return await api.put('/cart/items', { productId, quantity });
  },

  // Remove an item from the cart
  removeFromCart: async (productId) => {
    return await api.delete(`/cart/items/${productId}`);
  },

  // Clear the entire cart
  clearCart: async () => {
    return await api.delete('/cart');
  },
};

export default cartApi;