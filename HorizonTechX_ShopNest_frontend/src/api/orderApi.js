import api from './axios';

export const orderApi = {
  // get all orders for user
  getOrders: async (params = {}) => {
    return await api.get('/orders/my-orders', { params });
  },

  // fetch a specific order by ID
  getOrderById: async (orderId) => {
    return await api.get(`/orders/${orderId}`);
  },

  // create a new order
  createOrder: async (orderData) => {
    return await api.post('/orders', orderData);
  },
};

export default orderApi;