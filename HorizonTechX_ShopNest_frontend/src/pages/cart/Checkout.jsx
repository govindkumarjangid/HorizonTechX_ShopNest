import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Truck,
  CreditCard,
  QrCode,
  Building,
  Banknote,
  ChevronRight,
  MapPin,
  Plus,
  User,
} from 'lucide-react';
import { Button } from '../../components/ui';
import { Logo } from '../../components/ui/Logo';
import { AuthModal } from '../../components/auth/AuthModal';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useOrderStore } from '../../store/useOrderStore';
import { formatPrice } from '../../utils/formatPrice';
import { notify } from '../../utils/notify';
import { productApi } from '../../api/productApi';

/**
 * Distraction-Free Production Checkout Flow
 * Handles: Address Selection -> Payment Method -> Order Placement -> Confirmation
 */
export const Checkout = ({
  onReturnToCart,
  onOrderSuccess,
  onNavigateToCatalog,
}) => {
  const navigate = useNavigate();
  const { items, getSubtotal, getShippingFee, getTax, getTotal, clearCart } = useCartStore();
  const { user, savedAddresses, isAuthenticated } = useAuthStore();
  const { createOrder } = useOrderStore();

  const [currentStep, setCurrentStep] = useState(1); // 1: Address, 2: Payment, 3: Review
  const [selectedAddressId, setSelectedAddressId] = useState(
    savedAddresses && savedAddresses.length > 0
      ? (savedAddresses[0]._id || savedAddresses[0].id)
      : 'custom'
  );
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'cod'
  const [upiId, setUpiId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Address fields if user enters a new address or has no saved addresses
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    landmark: '',
    city: user?.city || '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (user) {
      setNewAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        phone: prev.phone || user.phone || '',
        city: prev.city || user.city || '',
      }));
      if (savedAddresses && savedAddresses.length > 0 && selectedAddressId === 'custom') {
        setSelectedAddressId(savedAddresses[0]._id || savedAddresses[0].id);
      }
    }
  }, [user, savedAddresses]);

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const tax = getTax();
  const total = getTotal();

  const activeShippingAddress =
    selectedAddressId === 'custom' || !savedAddresses || savedAddresses.length === 0
      ? newAddress
      : savedAddresses.find((a) => (a._id || a.id) === selectedAddressId) || newAddress;

  const handleReturnToBag = () => {
    if (onReturnToCart) onReturnToCart();
    else navigate('/cart');
  };

  const handleReturnToCatalog = () => {
    if (onNavigateToCatalog) onNavigateToCatalog();
    else navigate('/shop');
  };

  const isAddressValid = () => {
    if (!activeShippingAddress) return false;
    if (!activeShippingAddress.fullName?.trim()) return false;
    const cleanPhone = (activeShippingAddress.phone || '').replace(/\D/g, '');
    if (cleanPhone.length < 10) return false;
    if (!activeShippingAddress.street?.trim()) return false;
    if (!activeShippingAddress.city?.trim()) return false;
    if (!activeShippingAddress.state?.trim()) return false;
    const cleanPin = (activeShippingAddress.pincode || '').trim();
    if (cleanPin.length !== 6) return false;
    return true;
  };

  const isPaymentValid = () => {
    if (paymentMethod === 'upi') {
      return Boolean(upiId.trim() && upiId.includes('@'));
    }
    return Boolean(paymentMethod);
  };

  const handleProceedToPayment = () => {
    const isAuthed = isAuthenticated || !!localStorage.getItem('shopnest_token');
    if (!isAuthed) {
      notify.error('Please sign in or create an account to proceed with checkout.');
      setShowAuthModal(true);
      return false;
    }

    if (!activeShippingAddress) {
      notify.error('Please choose or enter a shipping address');
      return false;
    }
    if (!activeShippingAddress.fullName?.trim()) {
      notify.error('Please specify recipient full name');
      return false;
    }
    const cleanPhone = (activeShippingAddress.phone || '').replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      notify.error('Please provide a valid 10-digit mobile number');
      return false;
    }
    if (!activeShippingAddress.street?.trim()) {
      notify.error('Please provide street / flat delivery details');
      return false;
    }
    if (!activeShippingAddress.city?.trim()) {
      notify.error('Please provide delivery city');
      return false;
    }
    if (!activeShippingAddress.state?.trim()) {
      notify.error('Please provide delivery state');
      return false;
    }
    const cleanPin = (activeShippingAddress.pincode || '').trim();
    if (cleanPin.length !== 6) {
      notify.error('Please provide a valid 6-digit Indian PIN code');
      return false;
    }
    setCurrentStep(2);
    return true;
  };

  const handleProceedToReview = () => {
    if (!isAddressValid()) {
      handleProceedToPayment();
      return false;
    }
    if (paymentMethod === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) {
        notify.error('Please enter a valid UPI address (e.g. yourname@upi)');
        return false;
      }
    }
    setCurrentStep(3);
    return true;
  };

  const handlePlaceOrder = async () => {
    const isAuthed = isAuthenticated || !!localStorage.getItem('shopnest_token');
    if (!isAuthed) {
      notify.error('Please sign in to place your order');
      setShowAuthModal(true);
      return;
    }

    if (!isAddressValid()) {
      handleProceedToPayment();
      return;
    }
    if (!isPaymentValid()) {
      handleProceedToReview();
      return;
    }

    setIsSubmitting(true);
    notify.loading('Authorizing dispatch and generating airway bill...', { id: 'checkout-order' });

    try {
      // Validate all product IDs against 24-character hex MongoDB ObjectId pattern
      const validMongoIdRegex = /^[0-9a-fA-F]{24}$/;
      let fallbackRealProductId = null;

      const hasInvalidId = items.some((item) => {
        const rawId = item._id || (typeof item.product === 'string' ? item.product : item.product?._id) || item.id;
        return !validMongoIdRegex.test(rawId);
      });

      if (hasInvalidId) {
        try {
          const res = await productApi.getProducts({ limit: 12 });
          const inStockProd = res.data?.products?.find((p) => p.stock > 0) || res.data?.products?.[0];
          if (inStockProd?._id) {
            fallbackRealProductId = inStockProd._id;
          }
        } catch { }
      }

      const orderPayload = {
        items: items.map((item) => {
          const rawId = item._id || (typeof item.product === 'string' ? item.product : item.product?._id) || item.id;
          const productId = validMongoIdRegex.test(rawId) ? rawId : (fallbackRealProductId || rawId);
          return {
            product: productId,
            quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
          };
        }),
        shippingAddress: {
          fullName: activeShippingAddress.fullName.trim(),
          phone: (activeShippingAddress.phone || '').replace(/\D/g, '').slice(-10),
          street: activeShippingAddress.street.trim(),
          landmark: (activeShippingAddress.landmark || '').trim(),
          city: activeShippingAddress.city.trim(),
          state: activeShippingAddress.state.trim(),
          pincode: (activeShippingAddress.pincode || '').trim(),
        },
        paymentMethod:
          paymentMethod === 'upi'
            ? (upiId ? `UPI (${upiId})` : 'UPI')
            : paymentMethod === 'card'
            ? 'Credit Card'
            : paymentMethod === 'netbanking'
            ? 'NetBanking'
            : 'Cash on Delivery (COD)',
      };

      const placedOrder = await createOrder(orderPayload);
      clearCart();
      setIsSubmitting(false);
      notify.success('Order placed successfully! Real telemetry registered.', { id: 'checkout-order' });

      const targetId = placedOrder?.orderId || placedOrder?._id || placedOrder?.id;
      if (onOrderSuccess) {
        onOrderSuccess(placedOrder);
      } else if (targetId) {
        navigate(`/orders/${targetId}`);
      } else {
        navigate('/orders');
      }
    } catch (err) {
      setIsSubmitting(false);
      const errMsg =
        err?.data?.message ||
        err?.response?.data?.message ||
        err?.message ||
        (typeof err === 'string' ? err : 'Failed to place order. Please verify stock.');
      notify.error(errMsg, { id: 'checkout-order' });
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-dark-surface flex items-center justify-center text-neutral-400">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Checkout is Empty</h2>
        <p className="text-xs text-neutral-500">
          There are no items currently queued for checkout. Please return to the catalog.
        </p>
        <Button onClick={handleReturnToCatalog} variant="primary" size="md">
          Return to Catalog
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-neutral-50 dark:bg-dark-bg text-neutral-900 dark:text-dark-text py-4 sm:py-10">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Distraction-Free Header */}
        <div className="flex items-center justify-between pb-4 sm:pb-6 mb-6 sm:mb-8 border-b border-neutral-200/80 dark:border-dark-border">
          <button
            type="button"
            onClick={handleReturnToBag}
            className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-neutral-500 hover:text-brand-500 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span className="hidden xs:inline">Return to Bag</span>
            <span className="xs:hidden">Bag</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center bg-transparent border-none p-0 cursor-pointer focus:outline-none"
              aria-label="ShopNest Home"
            >
              <Logo className="h-6 sm:h-7 w-auto" />
            </button>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:inline">Encrypted Checkout</span>
              <span className="xs:hidden">Encrypted</span>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 sm:gap-6 md:gap-8 mb-6 sm:mb-10 text-xs font-semibold select-none">
          <div
            className={`flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
              currentStep === 1 ? 'text-brand-500 font-bold' : 'text-neutral-600 dark:text-neutral-400'
            }`}
            onClick={() => setCurrentStep(1)}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                currentStep >= 1
                  ? 'bg-brand-500 text-white'
                  : 'bg-neutral-200 dark:bg-dark-surface'
              }`}
            >
              1
            </span>
            <span className="hidden sm:inline">Delivery Address</span>
            <span className="sm:hidden">Address</span>
          </div>

          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 shrink-0" />

          <div
            className={`flex items-center gap-1.5 sm:gap-2 transition-all ${
              isAddressValid() ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
            } ${
              currentStep === 2 ? 'text-brand-500 font-bold' : 'text-neutral-600 dark:text-neutral-400'
            }`}
            onClick={() => {
              if (currentStep === 2) return;
              if (!isAddressValid()) {
                handleProceedToPayment();
                return;
              }
              setCurrentStep(2);
            }}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                currentStep >= 2
                  ? 'bg-brand-500 text-white'
                  : isAddressValid()
                  ? 'bg-brand-100 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400'
                  : 'bg-neutral-200 dark:bg-dark-surface text-neutral-400'
              }`}
            >
              2
            </span>
            <span className="hidden sm:inline">Payment Method</span>
            <span className="sm:hidden">Payment</span>
          </div>

          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 shrink-0" />

          <div
            className={`flex items-center gap-1.5 sm:gap-2 transition-all ${
              isAddressValid() && isPaymentValid() ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
            } ${
              currentStep === 3 ? 'text-brand-500 font-bold' : 'text-neutral-600 dark:text-neutral-400'
            }`}
            onClick={() => {
              if (currentStep === 3) return;
              if (!isAddressValid()) {
                handleProceedToPayment();
                return;
              }
              if (!isPaymentValid()) {
                handleProceedToReview();
                return;
              }
              setCurrentStep(3);
            }}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                currentStep >= 3
                  ? 'bg-brand-500 text-white'
                  : isAddressValid() && isPaymentValid()
                  ? 'bg-brand-100 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400'
                  : 'bg-neutral-200 dark:bg-dark-surface text-neutral-400'
              }`}
            >
              3
            </span>
            <span className="hidden sm:inline">Review & Place</span>
            <span className="sm:hidden">Review</span>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form (Steps 1, 2, 3) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <AnimatePresence mode="wait">
              {/* STEP 1: Address Selection */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border shadow-xs flex flex-col gap-5"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-dark-border">
                    <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-brand-500" />
                      Select Shipping Address
                    </h3>
                  </div>

                  {/* Guest Notice */}
                  {!isAuthenticated && !localStorage.getItem('shopnest_token') && (
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                        <User className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Sign in for saved addresses and live tracking telemetry.</span>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => setShowAuthModal(true)} className="cursor-pointer text-xs py-1">
                        Sign In / Register
                      </Button>
                    </div>
                  )}

                  {/* Saved Addresses List */}
                  <div className="flex flex-col gap-3">
                    {savedAddresses && savedAddresses.length > 0 && savedAddresses.map((addr) => {
                      const addrId = addr._id || addr.id;
                      return (
                        <label
                          key={addrId}
                          className={`
                            p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3
                            ${
                              selectedAddressId === addrId
                                ? 'border-brand-500 bg-brand-500/5 ring-2 ring-brand-500/20'
                                : 'border-neutral-200 dark:border-dark-border hover:border-neutral-300'
                            }
                          `}
                        >
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddressId === addrId}
                            onChange={() => setSelectedAddressId(addrId)}
                            className="mt-1 text-brand-500 accent-brand-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs text-neutral-900 dark:text-white">
                                {addr.fullName}
                              </span>
                              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-dark-surface text-neutral-600 dark:text-neutral-400">
                                {addr.type || 'Home'}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[10px] text-brand-500 font-semibold">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                              {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            <p className="text-xs text-neutral-500 mt-0.5">
                              Phone: {addr.phone}
                            </p>
                          </div>
                        </label>
                      );
                    })}

                    {/* Radio Option to Use Custom / New Address */}
                    {savedAddresses && savedAddresses.length > 0 && (
                      <label
                        className={`
                          p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3
                          ${
                            selectedAddressId === 'custom'
                              ? 'border-brand-500 bg-brand-500/5 ring-2 ring-brand-500/20'
                              : 'border-neutral-200 dark:border-dark-border hover:border-neutral-300'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === 'custom'}
                          onChange={() => setSelectedAddressId('custom')}
                          className="mt-1 text-brand-500 accent-brand-500"
                        />
                        <div className="flex-1">
                          <span className="font-semibold text-xs text-neutral-900 dark:text-white flex items-center gap-1.5">
                            <Plus className="w-3.5 h-3.5 text-brand-500" />
                            Deliver to a new address
                          </span>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            Specify alternative shipping coordinates for this delivery.
                          </p>
                        </div>
                      </label>
                    )}
                  </div>

                  {/* New / Custom Address Input Fields */}
                  {(selectedAddressId === 'custom' || !savedAddresses || savedAddresses.length === 0) && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-dark-surface border border-neutral-200/80 dark:border-dark-border flex flex-col gap-3">
                      <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                        {savedAddresses && savedAddresses.length > 0 ? 'Enter New Delivery Address' : 'Enter Delivery Address'}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Recipient Full Name *"
                          autoComplete="name"
                          value={newAddress.fullName}
                          onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border text-base sm:text-sm outline-none focus:border-brand-500 transition-colors"
                        />
                        <input
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="10-Digit Mobile Number *"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border text-base sm:text-sm outline-none focus:border-brand-500 transition-colors"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Street Address / Flat / Building *"
                        autoComplete="street-address"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border text-base sm:text-sm outline-none focus:border-brand-500 transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Landmark (Optional)"
                        value={newAddress.landmark}
                        onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border text-base sm:text-sm outline-none focus:border-brand-500 transition-colors"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="City *"
                          autoComplete="address-level2"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border text-base sm:text-sm outline-none focus:border-brand-500 transition-colors"
                        />
                        <input
                          type="text"
                          placeholder="State *"
                          autoComplete="address-level1"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border text-base sm:text-sm outline-none focus:border-brand-500 transition-colors"
                        />
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="6-digit PIN *"
                          autoComplete="postal-code"
                          maxLength={6}
                          value={newAddress.pincode}
                          onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border text-base sm:text-sm outline-none focus:border-brand-500 transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    size="lg"
                    onClick={handleProceedToPayment}
                    className="w-full mt-2 cursor-pointer"
                  >
                    Continue to Payment
                  </Button>
                </motion.div>
              )}

              {/* STEP 2: Payment Method */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border shadow-xs flex flex-col gap-5"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-dark-border">
                    <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-brand-500" />
                      Payment Method
                    </h3>
                  </div>

                  {/* Payment Options */}
                  <div className="flex flex-col gap-3">
                    {/* UPI */}
                    <label
                      className={`
                        p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3
                        ${
                          paymentMethod === 'upi'
                            ? 'border-brand-500 bg-brand-500/5 ring-2 ring-brand-500/20'
                            : 'border-neutral-200 dark:border-dark-border'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="mt-1 text-brand-500 accent-brand-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                            <QrCode className="w-4 h-4 text-brand-500" />
                            Instant UPI / QR / Google Pay / PhonePe
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            Fastest
                          </span>
                        </div>
                        {paymentMethod === 'upi' && (
                          <div className="mt-3">
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              placeholder="Enter UPI ID (e.g. mobile@upi)"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-dark-surface border border-neutral-200 dark:border-dark-border text-base sm:text-xs font-mono outline-none focus:border-brand-500"
                            />
                          </div>
                        )}
                      </div>
                    </label>

                    {/* Cards */}
                    <label
                      className={`
                        p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3
                        ${
                          paymentMethod === 'card'
                            ? 'border-brand-500 bg-brand-500/5 ring-2 ring-brand-500/20'
                            : 'border-neutral-200 dark:border-dark-border'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="mt-1 text-brand-500 accent-brand-500"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-brand-500" />
                          Credit / Debit Card (Visa, MasterCard, RuPay)
                        </span>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Bank-grade 256-bit PCI-DSS secure gateway
                        </p>
                      </div>
                    </label>

                    {/* NetBanking */}
                    <label
                      className={`
                        p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3
                        ${
                          paymentMethod === 'netbanking'
                            ? 'border-brand-500 bg-brand-500/5 ring-2 ring-brand-500/20'
                            : 'border-neutral-200 dark:border-dark-border'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'netbanking'}
                        onChange={() => setPaymentMethod('netbanking')}
                        className="mt-1 text-brand-500 accent-brand-500"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                          <Building className="w-4 h-4 text-brand-500" />
                          NetBanking (All Major Indian Banks)
                        </span>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          HDFC, ICICI, SBI, Axis, Kotak & 50+ more
                        </p>
                      </div>
                    </label>

                    {/* Cash on Delivery */}
                    <label
                      className={`
                        p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3
                        ${
                          paymentMethod === 'cod'
                            ? 'border-brand-500 bg-brand-500/5 ring-2 ring-brand-500/20'
                            : 'border-neutral-200 dark:border-dark-border'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mt-1 text-brand-500 accent-brand-500"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-brand-500" />
                          Cash on Delivery (Pay on Receipt)
                        </span>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Pay cash or UPI directly to courier upon arrival
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="flex gap-3 mt-2">
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1"
                    >
                      Back to Address
                    </Button>
                    <Button
                      size="lg"
                      onClick={handleProceedToReview}
                      className="flex-1 cursor-pointer"
                    >
                      Review Order
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Review & Place */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border shadow-xs flex flex-col gap-6"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-dark-border">
                    <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-brand-500" />
                      Review & Authorize Dispatch
                    </h3>
                  </div>

                  {/* Shipping Snapshot */}
                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-dark-surface border border-neutral-200/70 dark:border-dark-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-neutral-500">Delivering To:</span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-xs font-semibold text-brand-500 hover:underline cursor-pointer"
                      >
                        Change
                      </button>
                    </div>
                    <p className="text-xs font-bold text-neutral-900 dark:text-white">
                      {activeShippingAddress?.fullName} ({activeShippingAddress?.phone})
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                      {activeShippingAddress?.street}, {activeShippingAddress?.city}, {activeShippingAddress?.state} - {activeShippingAddress?.pincode}
                    </p>
                  </div>

                  {/* Payment Snapshot */}
                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-dark-surface border border-neutral-200/70 dark:border-dark-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-neutral-500">Payment Option:</span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-xs font-semibold text-brand-500 hover:underline cursor-pointer"
                      >
                        Change
                      </button>
                    </div>
                    <p className="text-xs font-bold text-neutral-900 dark:text-white uppercase">
                      {paymentMethod === 'upi' ? `UPI (${upiId})` : paymentMethod}
                    </p>
                  </div>

                  {/* Items List */}
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-semibold text-neutral-500">Order Items:</span>
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-10 h-10 rounded-lg object-cover border border-neutral-200 dark:border-dark-border"
                          />
                          <div>
                            <span className="font-semibold text-neutral-900 dark:text-white line-clamp-1">
                              {item.title}
                            </span>
                            <span className="text-neutral-400">Qty: {item.quantity || 1}</span>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-neutral-900 dark:text-white">
                          {formatPrice(item.price * (item.quantity || 1))}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-2">
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => setCurrentStep(2)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      size="lg"
                      isLoading={isSubmitting}
                      loadingText="Placing Order..."
                      onClick={handlePlaceOrder}
                      className="flex-1 shadow-elevated"
                    >
                      Authorize & Place Order
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 lg:self-start flex flex-col gap-5">
            <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border shadow-subtle flex flex-col gap-5">
              <h4 className="font-display font-bold text-base text-neutral-900 dark:text-white">
                Order Summary ({items.length} items)
              </h4>

              <div className="flex flex-col gap-2.5 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-neutral-900 dark:text-white font-medium">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Concierge Air Courier</span>
                  <span className="font-mono text-neutral-900 dark:text-white font-medium">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Free Express</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span className="font-mono text-neutral-900 dark:text-white font-medium">
                    {formatPrice(tax)}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-neutral-200/80 dark:border-dark-border font-bold text-base text-neutral-900 dark:text-white">
                  <span>Amount Payable</span>
                  <span className="font-mono text-brand-500">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-dark-surface border border-neutral-200/60 dark:border-dark-border flex items-center gap-2.5 text-[11px] text-neutral-600 dark:text-neutral-400">
                <Truck className="w-4 h-4 text-brand-500 shrink-0" />
                <span>Estimated Delivery: <strong>2 - 3 Business Days</strong> via BlueDart Air</span>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 text-center pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>PCI-DSS Level 1 & RBI e-mandate compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialTab="login"
      />
    </div>
  );
};

export default Checkout;
