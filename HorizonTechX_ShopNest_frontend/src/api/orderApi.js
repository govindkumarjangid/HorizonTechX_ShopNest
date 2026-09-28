import api from './axios';

/**
 * Order Management & Tracking API Service (Real Backend)
 * Zero mock fallbacks: Direct integration with MongoDB Order collection.
 */
export const orderApi = {
  /**
   * Fetch all orders for current authenticated user
   */
  getOrders: async (params = {}) => {
    return await api.get('/orders/my-orders', { params });
  },

  /**
   * Fetch specific order details by ID
   */
  getOrderById: async (orderId) => {
    return await api.get(`/orders/${orderId}`);
  },

  /**
   * Create a new order (Checkout)
   */
  createOrder: async (orderData) => {
    return await api.post('/orders', orderData);
  },
};

export default orderApi;
