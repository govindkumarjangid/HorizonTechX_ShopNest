import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  Edit2,
  Check,
  Plus,
  Trash2,
  Shield,
  ShoppingBag,
  Search,
} from 'lucide-react';
import { Button, Badge } from '../../components/ui';
import { OrderCard } from '../../components/orders/OrderCard';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useProductStore } from '../../store/useProductStore';
import { formatPrice } from '../../utils/formatPrice';
import { notify } from '../../utils/notify';

/**
 * My Account Dashboard (Real Backend API Integration)
 * Replicates the exact layout and structure from the user reference:
 * - "My Account" header with "Welcome back, {user.name}"
 * - Left Navigation Sidebar with active terracotta pill
 * - Right Content Card with Personal Information, Orders, Wishlist & Addresses
 */
export const Dashboard = ({
  initialTab = 'profile',
  onAddToCart,
  onNavigateToCatalog,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get('tab') || initialTab;
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  const handleTabSwitch = (tab) => {
    setSearchParams({ tab });
  };

  const {
    user,
    savedAddresses,
    logout,
    updateProfile,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    toggleWishlist,
    isAuthenticated,
  } = useAuthStore();

  const { orders, fetchOrders } = useOrderStore();
  const { products: allProducts, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (!allProducts || allProducts.length === 0) {
      fetchProducts({ limit: 50 });
    }
  }, [fetchProducts, allProducts]);

  const filteredOrders = (orders || []).filter((o) => {
    if (!orderSearchQuery.trim()) return true;
    const q = orderSearchQuery.toLowerCase();
    const id = (o.orderId || o._id || o.id || '').toLowerCase();
    const tracking = (o.trackingNumber || '').toLowerCase();
    const itemNames = (o.items || []).map((i) => (i.title || i.name || '').toLowerCase()).join(' ');
    return id.includes(q) || tracking.includes(q) || itemNames.includes(q);
  });

  // Local form state for profile editing
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'User',
    city: user?.city || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'User',
        city: user.city || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Local form state for adding address
  const [newAddr, setNewAddr] = useState({
    type: 'Home',
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    landmark: '',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    isDefault: false,
  });

  // Resolve user wishlist against real loaded products
  const userWishlistIds = user?.wishlist || [];
  const wishlist = allProducts.filter((p) =>
    userWishlistIds.includes(p._id || p.id)
  );

  const handleSaveProfile = async () => {
    if (!formData.name?.trim()) {
      notify.error('Name cannot be blank');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email?.trim())) {
      notify.error('Please enter a valid email address');
      return;
    }

    setIsSavingProfile(true);
    try {
      await updateProfile(formData);
      setIsEditingProfile(false);
      notify.success('Personal profile updated successfully!');
    } catch (err) {
      notify.error(err.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleRemoveWishlist = async (id) => {
    await toggleWishlist(id);
    notify.info('Item removed from wishlist');
  };

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCartWishlist = (product) => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addItem(product, 1);
    }
    const pTitle = product.name || product.title;
    notify.success(`${pTitle} added to your bag!`);
  };

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    if (!newAddr.fullName?.trim()) {
      notify.error('Please enter recipient full name');
      return;
    }
    const cleanPhone = (newAddr.phone || '').replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      notify.error('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!newAddr.street?.trim()) {
      notify.error('Please enter street / apartment details');
      return;
    }
    if (!newAddr.city?.trim()) {
      notify.error('Please enter delivery city');
      return;
    }
    if (!newAddr.state?.trim()) {
      notify.error('Please enter delivery state');
      return;
    }
    const cleanPin = (newAddr.pincode || '').trim();
    if (cleanPin.length !== 6) {
      notify.error('Please enter a valid 6-digit Indian PIN code');
      return;
    }

    setIsSavingAddress(true);
    try {
      await addAddress({
        ...newAddr,
        phone: cleanPhone.slice(-10),
        pincode: cleanPin,
      });
      setShowAddAddressModal(false);
      notify.success('New delivery address added successfully!');
      setNewAddr({
        type: 'Home',
        fullName: user?.name || '',
        phone: user?.phone || '',
        street: '',
        landmark: '',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
        isDefault: false,
      });
    } catch (err) {
      notify.error(err?.response?.data?.message || err.message || 'Failed to add address');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await deleteAddress(id);
      notify.info('Delivery address removed');
    } catch (err) {
      notify.error(err?.response?.data?.message || err.message || 'Failed to remove address');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      notify.success('Default delivery address updated');
    } catch (err) {
      notify.error(err?.response?.data?.message || err.message || 'Failed to set default address');
    }
  };

  const handleLogout = async () => {
    await logout();
    notify.info('You have signed out successfully.');
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
      {/* PAGE HEADER (Matching reference image) */}
      <div className="flex flex-col gap-1 mb-8 sm:mb-10">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          My Account
        </h1>
        <p className="font-sans text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
          Welcome back, <strong className="text-neutral-900 dark:text-white">{user?.name || 'User'}</strong>
        </p>
      </div>

      {/* 2-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT SIDEBAR NAVIGATION CARD (Sticky on Scroll) */}
        <div className="lg:col-span-4 sticky top-24 z-10 self-start">
          <div className="bg-white dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border rounded-3xl p-3 sm:p-4 shadow-subtle flex flex-col gap-1.5">
            {/* 1. Profile & Settings */}
            <button
              type="button"
              onClick={() => handleTabSwitch('profile')}
              className={`
                w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer
                ${activeTab === 'profile'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-dark-surface'
                }
              `}
            >
              <User className={`w-5 h-5 ${activeTab === 'profile' ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'}`} />
              <span>Profile & Settings</span>
            </button>

            {/* 2. Order History & Tracking */}
            <button
              type="button"
              onClick={() => handleTabSwitch('orders')}
              className={`
                w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer
                ${activeTab === 'orders'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-dark-surface'
                }
              `}
            >
              <div className="flex items-center gap-3.5">
                <Package className={`w-5 h-5 ${activeTab === 'orders' ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'}`} />
                <span>Order History & Tracking</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-neutral-100 dark:bg-dark-surface text-neutral-600 dark:text-neutral-400'}`}>
                {orders?.length || 0}
              </span>
            </button>

            {/* 3. My Wishlist */}
            <button
              type="button"
              onClick={() => handleTabSwitch('wishlist')}
              className={`
                w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer
                ${activeTab === 'wishlist'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-dark-surface'
                }
              `}
            >
              <div className="flex items-center gap-3.5">
                <Heart className={`w-5 h-5 ${activeTab === 'wishlist' ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'}`} />
                <span>My Wishlist</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'wishlist' ? 'bg-white/20 text-white' : 'bg-neutral-100 dark:bg-dark-surface text-neutral-600 dark:text-neutral-400'}`}>
                {wishlist?.length || 0}
              </span>
            </button>

            {/* 4. Saved Addresses */}
            <button
              type="button"
              onClick={() => handleTabSwitch('addresses')}
              className={`
                w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer
                ${activeTab === 'addresses'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-dark-surface'
                }
              `}
            >
              <div className="flex items-center gap-3.5">
                <MapPin className={`w-5 h-5 ${activeTab === 'addresses' ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'}`} />
                <span>Saved Addresses</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'addresses' ? 'bg-white/20 text-white' : 'bg-neutral-100 dark:bg-dark-surface text-neutral-600 dark:text-neutral-400'}`}>
                {savedAddresses?.length || 0}
              </span>
            </button>

            {/* Divider */}
            <div className="my-2 border-t border-neutral-100 dark:border-dark-border" />

            {/* 5. Log Out Action */}
            <button
              type="button"
              onClick={handleLogout}
              className="
                w-full flex items-center gap-3.5 px-5 py-3 rounded-2xl text-sm font-semibold
                text-semantic-error hover:bg-rose-50 dark:hover:bg-rose-950/30
                transition-all duration-200 cursor-pointer
              "
            >
              <LogOut className="w-5 h-5 text-semantic-error" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* RIGHT MAIN CONTENT CONTAINER */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border rounded-3xl p-6 sm:p-8 lg:p-10 shadow-subtle min-h-[500px]">
            {/* TAB 1: PERSONAL INFORMATION */}
            {activeTab === 'profile' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-dark-border">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                    Personal Information
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={isEditingProfile ? Check : Edit2}
                    isLoading={isSavingProfile}
                    loadingText="Saving Changes..."
                    onClick={() => {
                      if (isEditingProfile) {
                        handleSaveProfile();
                      } else {
                        setIsEditingProfile(true);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    {isEditingProfile ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </div>

                {/* 2x2 Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  {/* Field 1: Full Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Full Name
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-3.5 rounded-2xl bg-neutral-50 dark:bg-dark-surface border border-neutral-200 dark:border-dark-border text-sm font-semibold text-neutral-900 dark:text-white outline-none focus:border-brand-500"
                      />
                    ) : (
                      <div className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-dark-surface border border-neutral-100 dark:border-dark-border/60">
                        <span className="font-display font-semibold text-sm sm:text-base text-neutral-900 dark:text-white">
                          {user?.name || 'User'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Field 2: Email Address */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Email Address
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-3.5 rounded-2xl bg-neutral-50 dark:bg-dark-surface border border-neutral-200 dark:border-dark-border text-sm font-semibold text-neutral-900 dark:text-white outline-none focus:border-brand-500 font-mono"
                      />
                    ) : (
                      <div className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-dark-surface border border-neutral-100 dark:border-dark-border/60">
                        <span className="font-mono text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 break-all">
                          {user?.email || ''}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Field 3: Role / Account Status */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Role / Account Status
                    </label>
                    <div className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-dark-surface border border-neutral-100 dark:border-dark-border/60 flex items-center justify-between">
                      <span className="font-display font-semibold text-sm sm:text-base text-neutral-900 dark:text-white">
                        {user?.role || 'User'}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                        Verified Member
                      </span>
                    </div>
                  </div>

                  {/* Field 4: Preferred Delivery Region */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Preferred Delivery City
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full p-3.5 rounded-2xl bg-neutral-50 dark:bg-dark-surface border border-neutral-200 dark:border-dark-border text-sm font-semibold text-neutral-900 dark:text-white outline-none focus:border-brand-500"
                      />
                    ) : (
                      <div className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-dark-surface border border-neutral-100 dark:border-dark-border/60">
                        <span className="font-display font-semibold text-sm sm:text-base text-neutral-900 dark:text-white">
                          {user?.city || 'New Delhi • 110001'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Security & Preferences Section */}
                <div className="mt-4 pt-6 border-t border-neutral-100 dark:border-dark-border flex flex-col gap-4">
                  <h3 className="font-display font-semibold text-base text-neutral-900 dark:text-white">
                    Account Security & Privacy
                  </h3>
                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-dark-surface/60 border border-neutral-200/60 dark:border-dark-border flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-500">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Two-Factor Authentication</h4>
                        <p className="text-[11px] text-neutral-500">Protected via device authorization & biometric passkeys</p>
                      </div>
                    </div>
                    <Badge variant="success" size="sm">Active</Badge>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ORDER HISTORY & TRACKING */}
            {activeTab === 'orders' && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 dark:border-dark-border gap-4">
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                      Order History & Shipments ({orders?.length || 0})
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Track past acquisitions and active hardware dispatches with live telemetry.
                    </p>
                  </div>

                  {/* Direct Live Tracking Search Bar */}
                  {orders && orders.length > 0 && (
                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="Track by Order # or AWB..."
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-50 dark:bg-dark-surface border border-neutral-200 dark:border-dark-border text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-brand-500 font-mono"
                      />
                    </div>
                  )}
                </div>

                {(!orders || orders.length === 0) ? (
                  <div className="text-center py-12 flex flex-col items-center gap-3">
                    <Package className="w-10 h-10 text-neutral-300" />
                    <p className="text-sm text-neutral-500">You haven't placed any orders yet.</p>
                    <Button size="sm" onClick={onNavigateToCatalog || (() => navigate('/shop'))}>
                      Explore Catalog
                    </Button>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-10 flex flex-col items-center gap-2">
                    <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      No orders match &ldquo;{orderSearchQuery}&rdquo;
                    </p>
                    <button
                      type="button"
                      onClick={() => setOrderSearchQuery('')}
                      className="text-xs text-brand-500 hover:underline cursor-pointer"
                    >
                      Clear search filter
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {filteredOrders.map((order) => {
                      const orderNavId = order._id || order.orderId || order.id;
                      return (
                        <OrderCard
                          key={orderNavId}
                          order={order}
                          onTrackDetails={() => navigate(`/orders/${orderNavId}`)}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: MY WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-dark-border">
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                      My Curated Wishlist ({wishlist.length})
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Hardware pieces reserved for your future workstation setup.
                    </p>
                  </div>
                </div>

                {wishlist.length === 0 ? (
                  <div className="text-center py-12 flex flex-col items-center gap-3">
                    <Heart className="w-10 h-10 text-neutral-300" />
                    <p className="text-sm text-neutral-500">Your wishlist is currently empty.</p>
                    <Button size="sm" onClick={onNavigateToCatalog || (() => navigate('/shop'))}>Explore Catalog</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-dark-surface border border-neutral-200/70 dark:border-dark-border flex gap-3.5 items-center"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-18 h-18 rounded-xl object-cover shrink-0 border border-neutral-200 dark:border-dark-border cursor-pointer"
                          onClick={() => navigate(`/product/${item.id}`)}
                        />
                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                          <h4
                            onClick={() => navigate(`/product/${item.id}`)}
                            className="font-display text-xs font-semibold text-neutral-900 dark:text-white truncate cursor-pointer hover:text-brand-500"
                          >
                            {item.title}
                          </h4>
                          <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white">
                            {formatPrice(item.price)}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <Button
                              size="sm"
                              leftIcon={ShoppingBag}
                              onClick={() => handleAddToCartWishlist(item)}
                              className="text-[11px] py-1 px-3 cursor-pointer"
                            >
                              Add to Bag
                            </Button>
                            <button
                              type="button"
                              onClick={() => handleRemoveWishlist(item.id)}
                              className="p-1.5 text-neutral-400 hover:text-semantic-error rounded-lg cursor-pointer"
                              title="Remove"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: SAVED ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-dark-border">
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                      Saved Delivery Addresses ({savedAddresses?.length || 0})
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Manage domestic and studio shipping destinations.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    leftIcon={Plus}
                    onClick={() => setShowAddAddressModal(true)}
                    className="cursor-pointer"
                  >
                    Add Address
                  </Button>
                </div>

                {(!savedAddresses || savedAddresses.length === 0) ? (
                  <div className="text-center py-12 flex flex-col items-center gap-3">
                    <MapPin className="w-10 h-10 text-neutral-300" />
                    <p className="text-sm text-neutral-500">No delivery addresses saved yet.</p>
                    <Button size="sm" leftIcon={Plus} onClick={() => setShowAddAddressModal(true)}>
                      Add First Address
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedAddresses.map((addr) => {
                      const addrId = addr._id || addr.id;
                      return (
                        <div
                          key={addrId}
                          className="p-5 rounded-2xl bg-neutral-50/80 dark:bg-dark-surface border border-neutral-200/70 dark:border-dark-border flex flex-col justify-between gap-4"
                        >
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-200/70 dark:bg-dark-card text-neutral-700 dark:text-neutral-300">
                                {addr.type || 'Home'}
                              </span>
                              {addr.isDefault && (
                                <Badge variant="brand" size="sm">Default</Badge>
                              )}
                            </div>
                            <h4 className="font-semibold text-sm text-neutral-900 dark:text-white mt-1">
                              {addr.fullName}
                            </h4>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                              {addr.street}
                              {addr.landmark && `, Near ${addr.landmark}`}
                              <br />
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            <span className="text-xs text-neutral-500 mt-1 font-mono">
                              Ph: {addr.phone}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 pt-3 border-t border-neutral-200/60 dark:border-dark-border text-xs">
                            {!addr.isDefault && (
                              <button
                                type="button"
                                onClick={() => handleSetDefault(addrId)}
                                className="text-brand-500 font-semibold hover:underline cursor-pointer"
                              >
                                Set as Default
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteAddress(addrId)}
                              className="text-neutral-400 hover:text-semantic-error ml-auto cursor-pointer"
                              title="Delete address"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Modal with Full Validation */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/65 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <h3 className="font-display font-bold text-xl text-neutral-900 dark:text-white mb-4">
              Add New Address
            </h3>
            <form onSubmit={handleCreateAddress} noValidate className="flex flex-col gap-3">
              <div className="flex gap-2 mb-1">
                {['Home', 'Office', 'Studio'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setNewAddr({ ...newAddr, type })}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      newAddr.type === type
                        ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400'
                        : 'border-neutral-200 dark:border-dark-border text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Recipient Full Name *"
                value={newAddr.fullName}
                onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface text-xs outline-none focus:border-brand-500"
              />
              <input
                type="tel"
                placeholder="10-Digit Phone Number *"
                value={newAddr.phone}
                onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface text-xs outline-none focus:border-brand-500"
              />
              <input
                type="text"
                placeholder="Street Address / Flat / Building *"
                value={newAddr.street}
                onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface text-xs outline-none focus:border-brand-500"
              />
              <input
                type="text"
                placeholder="Landmark (Optional)"
                value={newAddr.landmark}
                onChange={(e) => setNewAddr({ ...newAddr, landmark: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface text-xs outline-none focus:border-brand-500"
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="City *"
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface text-xs outline-none focus:border-brand-500"
                />
                <input
                  type="text"
                  placeholder="State *"
                  value={newAddr.state}
                  onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface text-xs outline-none focus:border-brand-500"
                />
                <input
                  type="text"
                  placeholder="6-digit PIN *"
                  maxLength={6}
                  value={newAddr.pincode}
                  onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface text-xs outline-none focus:border-brand-500"
                />
              </div>
              <div className="flex gap-2 mt-3">
                <Button type="submit" size="sm" isLoading={isSavingAddress} loadingText="Saving Address..." className="flex-1 cursor-pointer">Save Address</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddAddressModal(false)} className="cursor-pointer">Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
