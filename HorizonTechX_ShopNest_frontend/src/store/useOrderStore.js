import { create } from 'zustand';

/**
 * Zustand Order Store
 * Handles order placements, active orders, and checkout stages
 */
export const useOrderStore = create((set) => ({
  orders: [
    {
      id: 'ORD-89241',
      date: '24 Sep, 2026',
      status: 'Processing',
      statusStep: 1, // 0: Placed, 1: Processing, 2: Shipped, 3: Delivered
      paymentMethod: 'UPI / NetBanking',
      trackingNumber: 'HTX-IND-90214',
      shippingAddress: {
        fullName: 'Govind Jangid',
        street: 'Flat 402, Block C, Heritage Heights',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
      },
      items: [
        {
          id: 'prod-101',
          title: 'Aura Studio Wireless Noise-Cancelling Headphones',
          price: 24999,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        },
      ],
      total: 24999,
    },
    {
      id: 'ORD-78103',
      date: '12 Aug, 2026',
      status: 'Delivered',
      statusStep: 3,
      paymentMethod: 'Credit Card (Visa)',
      trackingNumber: 'HTX-IND-77312',
      shippingAddress: {
        fullName: 'Govind Jangid',
        street: 'Studio 12, Cyber Hub, Sector 24',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122002',
      },
      items: [
        {
          id: 'prod-102',
          title: 'Horizon Stealth Mechanical Keyboard (CNC Aluminum)',
          price: 16499,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
        },
        {
          id: 'prod-107',
          title: 'Strata Handcrafted Full-Grain Leather Desk Pad',
          price: 7499,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
        },
      ],
      total: 23998,
    },
  ],
  activeOrder: null,

  setActiveOrder: (order) => set({ activeOrder: order }),

  createOrder: (orderData) => {
    const id = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNumber = `HTX-IND-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id,
      date: 'Just Now',
      status: 'Processing',
      statusStep: 1,
      trackingNumber,
      ...orderData,
    };

    set((state) => ({
      orders: [newOrder, ...state.orders],
      activeOrder: newOrder,
    }));

    return newOrder;
  },
}));

export default useOrderStore;
