import { create } from 'zustand';

/**
 * Authentication & User Profile Store
 */
export const useAuthStore = create((set, get) => ({
  isAuthenticated: true, // Default to logged in so user immediately sees their dashboard!
  user: {
    name: 'Govind Jangid',
    email: 'govindjangid@gmail.com',
    role: 'User',
    city: 'New Delhi • 110001',
    phone: '+91 98765 43210',
    avatar: null,
    joinedDate: 'October 2025',
  },
  savedAddresses: [
    {
      id: 'addr-1',
      type: 'Home',
      fullName: 'Govind Jangid',
      phone: '+91 98765 43210',
      street: 'Flat 402, Block C, Heritage Heights',
      landmark: 'Near Metro Pillar 142',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
      isDefault: true,
    },
    {
      id: 'addr-2',
      type: 'Studio / Office',
      fullName: 'Govind Jangid',
      phone: '+91 98765 43210',
      street: 'Studio 12, Cyber Hub, Sector 24',
      landmark: 'Opposite Design Arcade',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      isDefault: false,
    },
  ],
  orders: [
    {
      id: 'ORD-89241',
      date: '24 Sep, 2026',
      status: 'Processing',
      statusStep: 1, // 0: Placed, 1: Processing, 2: Shipped, 3: Delivered
      paymentMethod: 'UPI / NetBanking',
      trackingNumber: 'HTX-IND-90214',
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

  wishlist: ['prod-101', 'prod-102'],

  toggleWishlist: (productId) => {
    const id = typeof productId === 'object' ? productId.id : productId;
    set((state) => {
      const exists = state.wishlist.includes(id);
      return {
        wishlist: exists
          ? state.wishlist.filter((item) => item !== id)
          : [...state.wishlist, id],
      };
    });
  },

  isInWishlist: (productId) => {
    const id = typeof productId === 'object' ? productId.id : productId;
    return get().wishlist.includes(id);
  },

  // Authentication actions
  login: (userData) => {
    set({
      isAuthenticated: true,
      user: {
        name: userData?.name || 'Govind Jangid',
        email: userData?.email || 'govindjangid@gmail.com',
        role: 'User',
        city: userData?.city || 'New Delhi • 110001',
        phone: userData?.phone || '+91 98765 43210',
        avatar: null,
        joinedDate: 'October 2025',
      },
    });
  },

  logout: () => {
    set({
      isAuthenticated: false,
      user: null,
    });
  },

  updateProfile: (updatedData) => {
    set((state) => ({
      user: { ...state.user, ...updatedData },
    }));
  },

  addAddress: (newAddress) => {
    const id = `addr-${Date.now()}`;
    set((state) => ({
      savedAddresses: [...state.savedAddresses, { ...newAddress, id }],
    }));
  },

  deleteAddress: (id) => {
    set((state) => ({
      savedAddresses: state.savedAddresses.filter((a) => a.id !== id),
    }));
  },

  setDefaultAddress: (id) => {
    set((state) => ({
      savedAddresses: state.savedAddresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      })),
    }));
  },
}));
