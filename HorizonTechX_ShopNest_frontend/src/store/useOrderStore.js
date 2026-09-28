import { create } from 'zustand';
import { orderApi } from '../api/orderApi';

export const useOrderStore = create((set, get) => ({
  orders: [],
  activeOrder: null,
  isLoading: false,
  error: null,

  setActiveOrder: (order) => set({ activeOrder: order }),

  // Fetch all orders for current user from backend
  fetchOrders: async () => {
    const token = localStorage.getItem('shopnest_token');
    if (!token) {
      set({ orders: [], isLoading: false });
      return [];
    }

    set({ isLoading: true, error: null });
    try {
      const response = await orderApi.getOrders();
      const data = response?.data;
      const orderList = Array.isArray(data) ? data : (data?.orders || []);

      set({
        orders: orderList,
        activeOrder: orderList[0] || null,
        isLoading: false,
      });

      return orderList;
    } catch (err) {
      console.warn('[useOrderStore] fetchOrders error:', err.message);
      set({ error: err.message, isLoading: false });
      return [];
    }
  },

  // Fetch specific single order details by ID
  fetchOrderById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderApi.getOrderById(id);
      const order = response?.data || null;
      set({ activeOrder: order, isLoading: false });
      return order;
    } catch (err) {
      console.error('[useOrderStore] fetchOrderById error:', err.message);
      set({ error: err.message, isLoading: false });
      return null;
    }
  },


  // Create and place a new order on backend
  createOrder: async (orderPayload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderApi.createOrder(orderPayload);
      const newOrder = response?.data;

      if (newOrder) {
        set((state) => ({
          orders: [newOrder, ...state.orders],
          activeOrder: newOrder,
          isLoading: false,
        }));
      }

      return newOrder;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
}));

export default useOrderStore;
