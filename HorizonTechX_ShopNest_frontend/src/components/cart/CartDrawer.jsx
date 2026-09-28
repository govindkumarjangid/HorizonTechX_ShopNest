import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { ProgressiveImage } from '../ui/ProgressiveImage';
import { backdropFade } from '../../styles/motion';
import { useSmoothScroll } from '../../providers/SmoothScrollProvider';
import { formatPrice } from '../../utils/formatPrice';

/**
 * Production-Ready Mini-Cart Drawer
 * Features animated slide-in, item quantity steppers, animated removal,
 * free shipping progress bar, and Lenis scroll prevention while open.
 */
export const CartDrawer = ({
  isOpen,
  onClose,
  items = [],
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onExploreCatalog,
}) => {
  const lenis = useSmoothScroll();

  // Stop background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      if (typeof lenis?.stop === 'function') lenis.stop();
      document.body.style.overflow = 'hidden';
    } else {
      if (typeof lenis?.start === 'function') lenis.start();
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (typeof lenis?.start === 'function') lenis.start();
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, lenis, onClose]);

  // Compute pricing
  const subtotal = items.reduce(
    (sum, item) => sum + (item.price * (item.quantity || 1)),
    0
  );
  const shippingFee = subtotal >= 4999 || subtotal === 0 ? 0 : 499;
  const tax = subtotal * 0.18; // 18% GST standard
  const total = subtotal + shippingFee + tax;

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  const responsiveDrawerVariants = {
    hidden: {
      y: isMobile ? '100%' : 0,
      x: isMobile ? 0 : '100%',
      opacity: 1,
    },
    visible: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
      y: isMobile ? '100%' : 0,
      x: isMobile ? 0 : '100%',
      opacity: 1,
      transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end">
          {/* Backdrop */}
          <motion.div
            variants={backdropFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950/65 backdrop-blur-sm"
          />

          {/* Drawer / Full-Screen Cart Panel on Mobile */}
          <motion.div
            variants={responsiveDrawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            className="
              relative w-full sm:max-w-md h-[100dvh] sm:h-full
              bg-white dark:bg-dark-surface
              border-0 sm:border-l border-neutral-200/80 dark:border-dark-border
              rounded-none sm:rounded-l-3xl
              flex flex-col shadow-2xl z-10 overflow-hidden overscroll-contain
            "
          >
            {/* 1. Header with Safe Area Inset Support */}
            <div className="px-5 sm:px-6 pt-[max(env(safe-area-inset-top),1.25rem)] pb-4 sm:py-6 border-b border-neutral-100 dark:border-dark-border/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-500 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white leading-tight">
                    Shopping Archive
                  </h3>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {items.length} {items.length === 1 ? 'item' : 'items'} selected
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Items List with Animated Transitions */}
            <div
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 flex flex-col gap-4"
            >
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12 gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-dark-card flex items-center justify-center text-neutral-400">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-base text-neutral-900 dark:text-white">
                      Your bag is empty
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mt-1">
                      Explore our store collection to add premium products to your space.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    rightIcon={ArrowRight}
                    onClick={() => {
                      onClose();
                      if (onExploreCatalog) onExploreCatalog();
                    }}
                  >
                    Explore Products
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                        className="
                          p-3.5 rounded-2xl bg-white dark:bg-dark-card
                          border border-neutral-200/70 dark:border-dark-border
                          flex gap-3.5 items-center shadow-xs
                        "
                      >
                        {/* Thumbnail with explicit aspect ratio */}
                        <div className="w-18 h-18 rounded-xl bg-neutral-100 dark:bg-dark-surface shrink-0 overflow-hidden relative border border-neutral-200/50 dark:border-dark-border/40">
                          <ProgressiveImage
                            src={item.image}
                            alt={item.title}
                            width={160}
                            aspectRatio="aspect-square"
                            className="w-full h-full"
                            imgClassName="w-full h-full object-cover object-center"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                          <h4 className="font-display font-medium text-xs text-neutral-900 dark:text-white truncate">
                            {item.title}
                          </h4>
                          <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white">
                            {formatPrice(item.price * (item.quantity || 1))}
                          </span>

                          {/* Stepper Controls */}
                          <div className="flex items-center justify-between mt-1 pt-1 border-t border-neutral-100 dark:border-dark-border/40">
                            <div className="flex items-center border border-neutral-200 dark:border-dark-border rounded-lg bg-neutral-50 dark:bg-dark-surface">
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))
                                }
                                disabled={(item.quantity || 1) <= 1}
                                className="p-1 hover:text-brand-500 disabled:opacity-35 disabled:hover:text-inherit cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-mono text-xs font-semibold px-2">
                                {item.quantity || 1}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateQuantity(item.id, (item.quantity || 1) + 1)
                                }
                                className="p-1 hover:text-brand-500 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.id)}
                              className="p-1 text-neutral-400 hover:text-semantic-error transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* 3. Footer & Summary Checkout */}
            {items.length > 0 && (
              <div className="p-5 sm:p-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] border-t border-neutral-100 dark:border-dark-border bg-neutral-50/50 dark:bg-dark-surface/80 flex flex-col gap-3">
                <div className="flex flex-col gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-neutral-900 dark:text-white font-medium">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-mono text-neutral-900 dark:text-white font-medium">
                      {shippingFee === 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400">Complimentary</span>
                      ) : (
                        formatPrice(shippingFee)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated GST (18%)</span>
                    <span className="font-mono text-neutral-900 dark:text-white font-medium">
                      {formatPrice(tax)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-neutral-200/80 dark:border-dark-border font-bold text-sm text-neutral-900 dark:text-white">
                    <span>Final Amount</span>
                    <span className="font-mono text-base text-brand-500 font-bold">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <Button
                  size="lg"
                  rightIcon={ArrowRight}
                  onClick={() => {
                    onClose();
                    if (onCheckout) onCheckout();
                  }}
                  className="w-full mt-2 shadow-elevated"
                >
                  Proceed to Checkout
                </Button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 text-center mt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>256-bit encrypted checkout • 30-day studio trial</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
