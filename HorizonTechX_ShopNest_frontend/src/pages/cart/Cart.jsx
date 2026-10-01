import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Check,
} from 'lucide-react';
import { H1, Subtitle, Button } from '../../components/ui';
import { CartItem } from '../../components/cart/CartItem';
import { CartSummary } from '../../components/cart/CartSummary';
import { EmptyState } from '../../components/common/EmptyState';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice } from '../../utils/formatPrice';
import { notify } from '../../utils/notify';

/**
 * Full Page Shopping Cart
 */
export const Cart = ({
  onNavigateToCatalog,
  onCheckout,
}) => {
  const navigate = useNavigate();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getShippingFee,
    getTax,
  } = useCartStore();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = getSubtotal();
  const discountAmount = promoApplied ? Math.round(subtotal * (discountPercent / 100)) : 0;
  const shippingFee = getShippingFee();
  const tax = getTax();
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee + tax);

  const freeShippingThreshold = 4999;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoCode.trim()) {
      notify.error('Please enter a promotional code');
      return;
    }

    const cleanedCode = promoCode.trim().toUpperCase();
    if (cleanedCode === 'SHOPNEST10' || cleanedCode === 'HORIZON') {
      setDiscountPercent(10);
      setPromoApplied(true);
      notify.success('10% Founder discount applied successfully!');
    } else {
      notify.error('Invalid promo code. Try "SHOPNEST10" for 10% off.');
    }
  };

  const handleRemove = (id) => {
    removeItem(id);
    notify.success('Item removed from your bag');
  };

  const handleClearBag = () => {
    clearCart();
    notify.success('Your bag has been cleared');
  };

  const handleContinueShopping = () => {
    if (onNavigateToCatalog) {
      onNavigateToCatalog();
    } else {
      navigate('/shop');
    }
  };

  const handleProceedCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <EmptyState
          icon={ShoppingBag}
          title="Your Bag is Empty"
          description="You haven't added any items to your bag yet. Explore our store collection to find premium tech and lifestyle essentials."
          actionLabel="Explore Products"
          onAction={handleContinueShopping}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-10 w-full">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleContinueShopping}
            className="text-xs font-semibold text-neutral-500 hover:text-brand-500 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>

          <button
            type="button"
            onClick={handleClearBag}
            className="text-xs font-semibold text-neutral-400 hover:text-semantic-error transition-colors cursor-pointer"
          >
            Clear Bag
          </button>
        </div>

        <H1 className="text-xl sm:text-2xl font-bold tracking-tight">
          Your Curated Bag ({items.reduce((acc, item) => acc + (item.quantity || 1), 0)})
        </H1>
        <Subtitle className="text-sm">
          Review your selected items before proceeding to checkout.
        </Subtitle>
      </div>

      {/* Layout Grid: Items vs Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {items.map((item, idx) => (
              <motion.div
                key={item.id || item._id || idx}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <CartItem
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={handleRemove}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Promo Code Accordion Box */}
          <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border shadow-xs mt-2">
            <form onSubmit={handleApplyPromo} noValidate className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Enter Promo Code (e.g. SHOPNEST10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-dark-surface border border-neutral-200 dark:border-dark-border text-base sm:text-sm font-mono text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-brand-500 uppercase"
                />
              </div>
              <Button type="submit" variant="secondary" size="md" className="shrink-0 cursor-pointer">
                Apply Code
              </Button>
            </form>

            {promoApplied && (
              <p className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> 10% Founder discount applied successfully!
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Summary */}
        <div className="lg:col-span-4 lg:sticky lg:top-20 self-start z-10 flex flex-col gap-5">
          <CartSummary
            subtotal={subtotal}
            shippingFee={shippingFee}
            tax={tax}
            total={finalTotal}
            onCheckout={handleProceedCheckout}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
