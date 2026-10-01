import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
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
  X,
  Home,
  Briefcase,
  Building2,
  Phone,
  Compass,
  Hash,
} from 'lucide-react';
import { Button, Badge, Input } from '../../components/ui';
import { ProgressiveImage } from '../../components/ui/ProgressiveImage';
import { OrderCard } from '../../components/orders/OrderCard';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useProductStore } from '../../store/useProductStore';
import { formatPrice } from '../../utils/formatPrice';
import { notify } from '../../utils/notify';


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
    wishlist: storeWishlist,
    isAuthenticated,
    isInitialized,
  } = useAuthStore();

  const { orders, fetchOrders } = useOrderStore();
  const { products: allProducts, fetchProducts } = useProductStore();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      notify.error('Please sign in to access your dashboard');
      navigate(`/auth?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`, { replace: true });
    }
  }, [isInitialized, isAuthenticated, navigate]);

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

  // Resolve wishlist items with fallback to loaded store products
  const wishlist = (storeWishlist || []).map((item) => {
    const itemId = typeof item === 'object' ? (item._id || item.id) : item;
    const fromStore = allProducts.find((p) => (p._id || p.id) === itemId);
    if (fromStore) {
      return {
        ...fromStore,
        id: itemId,
        _id: itemId,
        title: fromStore.name || fromStore.title,
        name: fromStore.name || fromStore.title,
        image: fromStore.image || (fromStore.images && fromStore.images[0]) || '',
        price: Number(fromStore.price) || 0,
      };
    }
    return typeof item === 'object'
      ? {
          ...item,
          id: itemId,
          _id: itemId,
          title: item.name || item.title || 'Curated Piece',
          name: item.name || item.title || 'Curated Piece',
          image: item.image || (item.images && item.images[0]) || '',
          price: Number(item.price) || 0,
        }
      : { id: itemId, _id: itemId, title: 'Curated Piece', name: 'Curated Piece', price: 0, image: '' };
  });

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
    notify.success('Item removed from wishlist');
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
      notify.success('Delivery address removed');
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
    notify.success('You have signed out successfully.');
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12 w-full">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-1 mb-6 sm:mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          My Account
        </h1>
        <p className="font-sans text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          Welcome back, <strong className="text-neutral-900 dark:text-white">{user?.name || 'User'}</strong>
        </p>
      </div>

      {/* 2-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* LEFT SIDEBAR NAVIGATION CARD (Sticky on Desktop, Horizontal Scroll on Mobile) */}
        <div className="lg:col-span-4 lg:sticky lg:top-20 z-10 lg:self-start w-full">
          <div className="bg-white dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border rounded-2xl lg:rounded-3xl p-1.5 sm:p-2.5 lg:p-4 shadow-subtle flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible no-scrollbar gap-1.5 sm:gap-2 lg:gap-1.5 touch-pan-x">
            {/* 1. Profile & Settings */}
            <button
              type="button"
              onClick={() => handleTabSwitch('profile')}
              className={`
                shrink-0 lg:w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 lg:py-3.5 rounded-xl lg:rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap min-h-10.5
                ${activeTab === 'profile'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-dark-surface'
                }
              `}
            >
              <User className={`w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 ${activeTab === 'profile' ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'}`} />
              <span>Profile & Settings</span>
            </button>

            {/* 2. Order History & Tracking */}
            <button
              type="button"
              onClick={() => handleTabSwitch('orders')}
              className={`
                shrink-0 lg:w-full flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 lg:py-3.5 rounded-xl lg:rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap min-h-10.5
                ${activeTab === 'orders'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-dark-surface'
                }
              `}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <Package className={`w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 ${activeTab === 'orders' ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'}`} />
                <span>Orders</span>
                <span className="hidden sm:inline">& Tracking</span>
              </div>
              <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold ml-1.5 ${activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-neutral-100 dark:bg-dark-surface text-neutral-600 dark:text-neutral-400'}`}>
                {orders?.length || 0}
              </span>
            </button>

            {/* 3. My Wishlist */}
            <button
              type="button"
              onClick={() => handleTabSwitch('wishlist')}
              className={`
                shrink-0 lg:w-full flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 lg:py-3.5 rounded-xl lg:rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap min-h-10.5
                ${activeTab === 'wishlist'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-dark-surface'
                }
              `}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 ${activeTab === 'wishlist' ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'}`} />
                <span>Wishlist</span>
              </div>
              <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold ml-1.5 ${activeTab === 'wishlist' ? 'bg-white/20 text-white' : 'bg-neutral-100 dark:bg-dark-surface text-neutral-600 dark:text-neutral-400'}`}>
                {wishlist?.length || 0}
              </span>
            </button>

            {/* 4. Saved Addresses */}
            <button
              type="button"
              onClick={() => handleTabSwitch('addresses')}
              className={`
                shrink-0 lg:w-full flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 lg:py-3.5 rounded-xl lg:rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap min-h-10.5
                ${activeTab === 'addresses'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-dark-surface'
                }
              `}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <MapPin className={`w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 ${activeTab === 'addresses' ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'}`} />
                <span>Addresses</span>
              </div>
              <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold ml-1.5 ${activeTab === 'addresses' ? 'bg-white/20 text-white' : 'bg-neutral-100 dark:bg-dark-surface text-neutral-600 dark:text-neutral-400'}`}>
                {savedAddresses?.length || 0}
              </span>
            </button>

            {/* Divider */}
            <div className="hidden lg:block my-2 border-t border-neutral-100 dark:border-dark-border" />

            {/* 5. Log Out Action */}
            <button
              type="button"
              onClick={handleLogout}
              className="
                shrink-0 lg:w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 rounded-xl lg:rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap min-h-10.5
                text-semantic-error hover:bg-rose-50 dark:hover:bg-rose-950/30
                transition-all duration-200 cursor-pointer ml-auto lg:ml-0
              "
            >
              <LogOut className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-semantic-error shrink-0" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* RIGHT MAIN CONTENT CONTAINER */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border rounded-3xl p-6 sm:p-8 lg:p-10 shadow-subtle min-h-125">
            {/* TAB 1: PERSONAL INFORMATION */}
            {activeTab === 'profile' && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-dark-border">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                    Personal Information
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={isEditingProfile ? Check : Edit2}
                    isLoading={isSavingProfile}
                    loadingText="Saving..."
                    onClick={() => {
                      if (isEditingProfile) {
                        handleSaveProfile();
                      } else {
                        setIsEditingProfile(true);
                      }
                    }}
                    className="cursor-pointer shrink-0 w-fit"
                  >
                    {isEditingProfile ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </div>

                {/* Profile Fields Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Field 1: Full Name */}
                  <div className="flex flex-col gap-1.5">
                    {isEditingProfile ? (
                      <Input
                        label="Full Name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    ) : (
                      <>
                        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          Full Name
                        </span>
                        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-neutral-50/80 dark:bg-dark-surface border border-neutral-100 dark:border-dark-border/60">
                          <span className="font-display font-semibold text-sm sm:text-base text-neutral-900 dark:text-white">
                            {user?.name || 'User'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Field 2: Email Address */}
                  <div className="flex flex-col gap-1.5">
                    {isEditingProfile ? (
                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="font-mono"
                      />
                    ) : (
                      <>
                        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          Email Address
                        </span>
                        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-neutral-50/80 dark:bg-dark-surface border border-neutral-100 dark:border-dark-border/60">
                          <span className="font-mono text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 break-all">
                            {user?.email || ''}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Field 3: Mobile Phone Number */}
                  <div className="flex flex-col gap-1.5">
                    {isEditingProfile ? (
                      <Input
                        label="Mobile Number"
                        type="tel"
                        inputMode="tel"
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="font-mono"
                      />
                    ) : (
                      <>
                        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          Mobile Number
                        </span>
                        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-neutral-50/80 dark:bg-dark-surface border border-neutral-100 dark:border-dark-border/60">
                          <span className="font-mono text-xs sm:text-sm text-neutral-800 dark:text-neutral-200">
                            {user?.phone || 'Not specified'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Field 4: Preferred Delivery City */}
                  <div className="flex flex-col gap-1.5">
                    {isEditingProfile ? (
                      <Input
                        label="Preferred Delivery City"
                        placeholder="City, State"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    ) : (
                      <>
                        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          Preferred Delivery City
                        </span>
                        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-neutral-50/80 dark:bg-dark-surface border border-neutral-100 dark:border-dark-border/60">
                          <span className="font-display font-semibold text-sm sm:text-base text-neutral-900 dark:text-white">
                            {user?.city || 'Not specified'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Field 5: Role / Account Status */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Role / Membership Status
                    </label>
                    <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-neutral-50/80 dark:bg-dark-surface border border-neutral-100 dark:border-dark-border/60 flex items-center justify-between">
                      <span className="font-display font-semibold text-sm sm:text-base text-neutral-900 dark:text-white">
                        {user?.role || 'User'}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                        Verified Member
                      </span>
                    </div>
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
                    <div className="w-full sm:w-64">
                      <Input
                        leftIcon={Search}
                        placeholder="Track by Order # or AWB..."
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                        className="font-mono text-base sm:text-xs"
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
                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-dark-border">
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
                    {wishlist.map((item) => {
                      const itemId = item._id || item.id;
                      const itemTitle = item.name || item.title || 'Curated Piece';
                      const itemImage = item.image || (item.images && item.images[0]) || '';
                      const itemPrice = Number(item.price) || 0;

                      return (
                        <div
                          key={itemId}
                          className="p-3.5 sm:p-4 rounded-2xl bg-neutral-50/80 dark:bg-dark-surface border border-neutral-200/70 dark:border-dark-border flex gap-3.5 items-center"
                        >
                          <ProgressiveImage
                            src={itemImage}
                            alt={itemTitle}
                            width={140}
                            aspectRatio="aspect-square"
                            className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl shrink-0 border border-neutral-200 dark:border-dark-border cursor-pointer overflow-hidden"
                            imgClassName="w-full h-full object-cover"
                            onClick={() => navigate(`/product/${itemId}`)}
                          />
                          <div className="flex-1 min-w-0 flex flex-col gap-1">
                            <h4
                              onClick={() => navigate(`/product/${itemId}`)}
                              className="font-display text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white truncate cursor-pointer hover:text-brand-500"
                            >
                              {itemTitle}
                            </h4>
                            <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white">
                              {formatPrice(itemPrice)}
                            </span>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <Button
                                size="sm"
                                leftIcon={ShoppingBag}
                                onClick={() => handleAddToCartWishlist(item)}
                                className="text-[11px] py-1.5 px-3 cursor-pointer shrink-0"
                              >
                                Add to Bag
                              </Button>
                              <button
                                type="button"
                                onClick={() => handleRemoveWishlist(itemId)}
                                className="p-1.5 text-neutral-400 hover:text-semantic-error rounded-lg cursor-pointer shrink-0"
                                title="Remove"
                                aria-label="Remove from wishlist"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: SAVED ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-dark-border">
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
                    className="cursor-pointer shrink-0 w-fit"
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

      {/* Add Address Modal with Premium UI & Animations */}
      <AnimatePresence>
        {showAddAddressModal && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/75 backdrop-blur-md overflow-y-auto no-scrollbar">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 14 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-dark-card border border-neutral-200/90 dark:border-dark-border rounded-3xl p-4.5 sm:p-6 max-w-lg w-full shadow-2xl relative overflow-y-auto no-scrollbar max-h-[92dvh] my-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-neutral-100 dark:border-dark-border">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-brand-500/10 dark:bg-brand-500/15 text-brand-500 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base sm:text-lg text-neutral-900 dark:text-white tracking-tight">
                      Add New Delivery Address
                    </h3>
                    <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400">
                      Enter location details for insured courier dispatch
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-dark-surface transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAddress} noValidate className="flex flex-col gap-2.5 sm:gap-3">
                {/* Address Type Selection Pills */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Address Label
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { type: 'Home', icon: Home },
                      { type: 'Office', icon: Briefcase },
                      { type: 'Studio', icon: Building2 },
                    ].map(({ type, icon: Icon }) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNewAddr({ ...newAddr, type })}
                        className={`
                          flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer
                          ${
                            newAddr.type === type
                              ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400 shadow-xs ring-1 ring-brand-500/30'
                              : 'border-neutral-200 dark:border-dark-border text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-dark-surface'
                          }
                        `}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recipient Name & Phone in 2-col Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <Input
                    label="Recipient Name *"
                    leftIcon={User}
                    placeholder="John Doe"
                    value={newAddr.fullName}
                    onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                  />
                  <Input
                    label="Mobile Number *"
                    leftIcon={Phone}
                    type="tel"
                    inputMode="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="font-mono"
                  />
                </div>

                {/* Street Address */}
                <Input
                  label="Street Address / Flat / Floor / Building *"
                  leftIcon={MapPin}
                  placeholder="e.g. Flat 402, Apex Residency, MG Road"
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                />

                {/* Landmark */}
                <Input
                  label="Landmark (Optional)"
                  leftIcon={Compass}
                  placeholder="e.g. Near Metro Station / Behind Central Mall"
                  value={newAddr.landmark}
                  onChange={(e) => setNewAddr({ ...newAddr, landmark: e.target.value })}
                />

                {/* City, State, PIN Code in Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  <Input
                    label="City *"
                    placeholder="New Delhi"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  />
                  <Input
                    label="State *"
                    placeholder="Delhi"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                  />
                  <Input
                    label="PIN Code *"
                    leftIcon={Hash}
                    inputMode="numeric"
                    placeholder="110001"
                    maxLength={6}
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                    className="font-mono"
                  />
                </div>

                {/* Default Address Checkbox */}
                <label className="flex items-center gap-2 pt-0.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={newAddr.isDefault}
                    onChange={(e) => setNewAddr({ ...newAddr, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500/30 accent-brand-500 cursor-pointer"
                  />
                  <span className="text-xs text-neutral-600 dark:text-neutral-300 font-medium">
                    Set as default delivery address for future orders
                  </span>
                </label>

                {/* Form Action Buttons */}
                <div className="flex items-center gap-2.5 pt-1">
                  <Button
                    type="submit"
                    size="md"
                    isLoading={isSavingAddress}
                    loadingText="Saving Address..."
                    leftIcon={Check}
                    className="flex-1 cursor-pointer shadow-subtle"
                  >
                    Save Address
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => setShowAddAddressModal(false)}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
