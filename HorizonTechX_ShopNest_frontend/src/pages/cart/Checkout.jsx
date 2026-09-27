import { useState } from 'react';
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
} from 'lucide-react';
import { Button } from '../../components/ui';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useOrderStore } from '../../store/useOrderStore';
import { formatPrice } from '../../utils/formatPrice';
import { notify } from '../../utils/notify';

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
  const { user, savedAddresses } = useAuthStore();
  const { createOrder } = useOrderStore();

  const [currentStep, setCurrentStep] = useState(1); // 1: Address, 2: Payment, 3: Review
  const [selectedAddressId, setSelectedAddressId] = useState(savedAddresses[0]?.id || 'custom');
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'cod'
  const [upiId, setUpiId] = useState('govind@okaxis');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom address fields if user chooses new address
  const [newAddress] = useState({
    fullName: user?.name || 'Govind Jangid',
    phone: user?.phone || '+91 98765 43210',
    street: 'Flat 402, Block C, Heritage Heights',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
  });

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const tax = getTax();
  const total = getTotal();

  const activeShippingAddress =
    selectedAddressId === 'custom'
      ? newAddress
      : savedAddresses.find((a) => a.id === selectedAddressId) || savedAddresses[0];

  const handleReturnToBag = () => {
    if (onReturnToCart) onReturnToCart();
    else navigate('/cart');
  };

  const handleReturnToCatalog = () => {
    if (onNavigateToCatalog) onNavigateToCatalog();
    else navigate('/shop');
  };

  const handleProceedToPayment = () => {
    if (!activeShippingAddress) {
      notify.error('Please choose a valid shipping address');
      return;
    }
    if (!activeShippingAddress.fullName?.trim()) {
      notify.error('Please specify recipient full name');
      return;
    }
    if (!activeShippingAddress.phone?.trim() || activeShippingAddress.phone.length < 10) {
      notify.error('Please provide a valid 10-digit mobile number');
      return;
    }
    if (!activeShippingAddress.street?.trim()) {
      notify.error('Please provide street / flat delivery details');
      return;
    }
    if (!activeShippingAddress.pincode?.trim() || activeShippingAddress.pincode.length < 6) {
      notify.error('Please provide a valid 6-digit Indian PIN code');
      return;
    }
    setCurrentStep(2);
  };

  const handleProceedToReview = () => {
    if (paymentMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        notify.error('Please enter a valid UPI address (e.g. yourname@upi)');
        return;
      }
    }
    setCurrentStep(3);
  };

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    notify.loading('Authorizing dispatch and generating airway bill...', { id: 'checkout-order' });
    setTimeout(() => {
      const placedOrder = createOrder({
        items: [...items],
        shippingAddress: activeShippingAddress,
        paymentMethod:
          paymentMethod === 'upi'
            ? `UPI (${upiId})`
            : paymentMethod === 'card'
            ? 'Credit Card'
            : paymentMethod === 'netbanking'
            ? 'NetBanking'
            : 'Cash on Delivery (COD)',
        total,
        subtotal,
        shippingFee,
        tax,
      });

      clearCart();
      setIsSubmitting(false);
      notify.success('Order placed successfully! Telemetry registered.', { id: 'checkout-order' });

      if (onOrderSuccess) {
        onOrderSuccess(placedOrder);
      } else {
        navigate(`/orders/${placedOrder.id}`);
      }
    }, 1100);
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
    <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg text-neutral-900 dark:text-dark-text py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Distraction-Free Header */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-neutral-200/80 dark:border-dark-border">
          <button
            type="button"
            onClick={handleReturnToBag}
            className="flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-brand-500 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Bag</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-base tracking-tight text-neutral-900 dark:text-white">
              Shop<span className="text-brand-500">Nest</span>
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>Encrypted Checkout</span>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 sm:gap-8 mb-10 text-xs font-semibold">
          <div
            className={`flex items-center gap-2 cursor-pointer ${
              currentStep === 1 ? 'text-brand-500' : 'text-neutral-500'
            }`}
            onClick={() => setCurrentStep(1)}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                currentStep >= 1
                  ? 'bg-brand-500 text-white'
                  : 'bg-neutral-200 dark:bg-dark-surface'
              }`}
            >
              1
            </span>
            <span>Delivery Address</span>
          </div>

          <ChevronRight className="w-4 h-4 text-neutral-400" />

          <div
            className={`flex items-center gap-2 cursor-pointer ${
              currentStep === 2 ? 'text-brand-500' : 'text-neutral-500'
            }`}
            onClick={() => setCurrentStep(2)}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                currentStep >= 2
                  ? 'bg-brand-500 text-white'
                  : 'bg-neutral-200 dark:bg-dark-surface'
              }`}
            >
              2
            </span>
            <span>Payment Method</span>
          </div>

          <ChevronRight className="w-4 h-4 text-neutral-400" />

          <div
            className={`flex items-center gap-2 cursor-pointer ${
              currentStep === 3 ? 'text-brand-500' : 'text-neutral-500'
            }`}
            onClick={() => setCurrentStep(3)}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                currentStep >= 3
                  ? 'bg-brand-500 text-white'
                  : 'bg-neutral-200 dark:bg-dark-surface'
              }`}
            >
              3
            </span>
            <span>Review & Place</span>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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

                  {/* Saved Addresses List */}
                  <div className="flex flex-col gap-3">
                    {savedAddresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`
                          p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3
                          ${
                            selectedAddressId === addr.id
                              ? 'border-brand-500 bg-brand-500/5 ring-2 ring-brand-500/20'
                              : 'border-neutral-200 dark:border-dark-border hover:border-neutral-300'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1 text-brand-500 accent-brand-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-neutral-900 dark:text-white">
                              {addr.fullName}
                            </span>
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-dark-surface text-neutral-600 dark:text-neutral-400">
                              {addr.type}
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
                    ))}
                  </div>

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
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-dark-surface border border-neutral-200 dark:border-dark-border text-xs font-mono"
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
                      loading={isSubmitting}
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
          <div className="lg:col-span-5 lg:sticky lg:top-10 flex flex-col gap-5">
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
    </div>
  );
};

export default Checkout;
