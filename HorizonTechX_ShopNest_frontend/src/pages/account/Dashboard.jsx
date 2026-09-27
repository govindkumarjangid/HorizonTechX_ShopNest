import { useState } from 'react';
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
} from 'lucide-react';
import { Button, Badge } from '../../components/ui';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice } from '../../utils/formatPrice';
import { products } from '../../assets/assets';
import { notify } from '../../utils/notify';

/**
 * My Account Dashboard
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
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  const handleTabSwitch = (tab) => {
    setSearchParams({ tab });
  };

  const {
    user,
    orders,
    savedAddresses,
    logout,
    updateProfile,
    addAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAuthStore();

  // Local form state for profile editing
  const [formData, setFormData] = useState({
    name: user?.name || 'Govind Jangid',
    email: user?.email || 'govindjangid@gmail.com',
    role: user?.role || 'User',
    city: user?.city || 'New Delhi • 110001',
    phone: user?.phone || '+91 98765 43210',
  });

  // Local form state for adding address
  const [newAddr, setNewAddr] = useState({
    type: 'Home',
    fullName: user?.name || 'Govind Jangid',
    phone: user?.phone || '+91 98765 43210',
    street: '',
    landmark: '',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    isDefault: false,
  });

  // Sample wishlist items (3 items)
  const [wishlist, setWishlist] = useState([
    products[0],
    products[1],
    products[2],
  ]);

  const handleSaveProfile = () => {
    if (!formData.name?.trim()) {
      notify.error('Name cannot be blank');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email?.trim())) {
      notify.error('Please enter a valid email address');
      return;
    }

    updateProfile(formData);
    setIsEditingProfile(false);
    notify.success('Personal profile updated successfully!');
  };

  const handleRemoveWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
    notify.info('Item removed from wishlist');
  };

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCartWishlist = (product) => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addItem(product, 1);
    }
    notify.success(`${product.title} added to your bag!`);
  };

  const handleCreateAddress = (e) => {
    e.preventDefault();
    if (!newAddr.fullName?.trim()) {
      notify.error('Please enter recipient full name');
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
    if (!newAddr.pincode?.trim() || newAddr.pincode.length < 6) {
      notify.error('Please enter a valid 6-digit Indian PIN code');
      return;
    }

    addAddress(newAddr);
    setShowAddAddressModal(false);
    notify.success('New delivery address added successfully!');
    setNewAddr({
      type: 'Home',
      fullName: user?.name || 'Govind Jangid',
      phone: user?.phone || '+91 98765 43210',
      street: '',
      landmark: '',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
      isDefault: false,
    });
  };

  const handleDeleteAddress = (id) => {
    deleteAddress(id);
    notify.info('Delivery address removed');
  };

  const handleSetDefault = (id) => {
    setDefaultAddress(id);
    notify.success('Default delivery address updated');
  };

  const handleLogout = () => {
    logout();
    notify.info('You have signed out successfully.');
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
      {/* PAGE HEADER (Matching reference image) */}
      <div className="flex flex-col gap-1 mb-8 sm:mb-10">
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
          My Account
        </h1>
        <p className="font-sans text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
          Welcome back, <strong className="text-neutral-900 dark:text-white">{user?.name || 'Govind Jangid'}</strong>
        </p>
      </div>

      {/* 2-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT SIDEBAR NAVIGATION CARD (Sticky on Scroll) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 z-10 self-start">
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
                {orders?.length || 2}
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
                <span>My Wishlist ({wishlist.length})</span>
              </div>
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
                {savedAddresses?.length || 2}
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
                          {user?.name || 'Govind Jangid'}
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
                          {user?.email || 'govindjangid@gmail.com'}
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
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-dark-border">
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                      Order History & Shipments ({orders?.length || 0})
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Track past acquisitions and active hardware dispatches.
                    </p>
                  </div>
                </div>

                {orders?.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl bg-neutral-50/80 dark:bg-dark-surface border border-neutral-200/70 dark:border-dark-border flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white bg-white dark:bg-dark-card px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-dark-border">
                          {order.id}
                        </span>
                        <span className="text-xs text-neutral-500">
                          Placed on {order.date}
                        </span>
                      </div>
                      <Badge
                        variant={order.status === 'Delivered' ? 'success' : 'brand'}
                        size="sm"
                      >
                        {order.status}
                      </Badge>
                    </div>

                    {/* Items in order */}
                    <div className="flex flex-col gap-3">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-12 h-12 rounded-xl object-cover border border-neutral-200 dark:border-dark-border"
                            />
                            <div>
                              <h4 className="text-xs font-semibold text-neutral-900 dark:text-white line-clamp-1">
                                {item.title}
                              </h4>
                              <span className="text-[11px] text-neutral-400">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          </div>
                          <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer & Tracking Link */}
                    <div className="flex items-center justify-between pt-3 border-t border-neutral-200/60 dark:border-dark-border/60 text-xs">
                      <span className="text-neutral-500">
                        Airway Bill: <strong className="font-mono text-neutral-900 dark:text-white">{order.trackingNumber}</strong>
                      </span>
                      <div className="flex items-center gap-3">
                        <strong className="font-mono text-sm text-brand-500 font-bold">
                          {formatPrice(order.total)}
                        </strong>
                        <button
                          type="button"
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="text-xs text-brand-500 font-semibold hover:underline cursor-pointer"
                        >
                          View Telemetry →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedAddresses?.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-5 rounded-2xl bg-neutral-50/80 dark:bg-dark-surface border border-neutral-200/70 dark:border-dark-border flex flex-col justify-between gap-4"
                    >
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-200/70 dark:bg-dark-card text-neutral-700 dark:text-neutral-300">
                            {addr.type}
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
                            onClick={() => handleSetDefault(addr.id)}
                            className="text-brand-500 font-semibold hover:underline cursor-pointer"
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-neutral-400 hover:text-semantic-error ml-auto cursor-pointer"
                          title="Delete address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Modal with Toast Validation */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/65 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <h3 className="font-display font-bold text-xl text-neutral-900 dark:text-white mb-4">
              Add New Address
            </h3>
            <form onSubmit={handleCreateAddress} noValidate className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Recipient Full Name"
                value={newAddr.fullName}
                onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface text-xs outline-none focus:border-brand-500"
              />
              <input
                type="text"
                placeholder="Street Address / Flat No."
                value={newAddr.street}
                onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface text-xs outline-none focus:border-brand-500"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City (e.g. New Delhi)"
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface text-xs outline-none focus:border-brand-500"
                />
                <input
                  type="text"
                  placeholder="Pincode (e.g. 110001)"
                  value={newAddr.pincode}
                  onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface text-xs outline-none focus:border-brand-500"
                />
              </div>
              <div className="flex gap-2 mt-3">
                <Button type="submit" size="sm" className="flex-1 cursor-pointer">Save Address</Button>
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
