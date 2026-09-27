import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatPrice } from '../../utils/formatPrice';

/**
 * Reusable Cart Summary & Checkout Box
 */
export const CartSummary = ({
  subtotal = 0,
  shippingFee = 0,
  tax = 0,
  total = 0,
  onCheckout,
}) => {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border shadow-subtle flex flex-col gap-5">
      <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white">
        Order Summary
      </h3>

      <div className="flex flex-col gap-2.5 text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-mono text-neutral-900 dark:text-white font-medium">
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Estimated Shipping</span>
          <span className="font-mono text-neutral-900 dark:text-white font-medium">
            {shippingFee === 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Free Express</span>
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
        <div className="flex justify-between pt-3 border-t border-neutral-200/80 dark:border-dark-border font-bold text-base text-neutral-900 dark:text-white">
          <span>Final Total</span>
          <span className="font-mono text-brand-500">{formatPrice(total)}</span>
        </div>
      </div>

      <Button size="lg" rightIcon={ArrowRight} onClick={onCheckout} className="w-full shadow-elevated">
        Proceed to Secure Checkout
      </Button>

      <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 text-center">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Bank-grade 256-bit encryption • PCI-DSS verified</span>
      </div>
    </div>
  );
};

export default CartSummary;
