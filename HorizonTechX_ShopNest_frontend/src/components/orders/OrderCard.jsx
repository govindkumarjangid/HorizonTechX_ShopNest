import React from 'react';
import { ChevronRight } from 'lucide-react';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderTracker } from './OrderTracker';
import { formatPrice } from '../../utils/formatPrice';

/**
 * Reusable Order Summary Card with Tracking Timeline
 */
export const OrderCard = ({ order, onTrackDetails }) => {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border shadow-subtle flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-dark-border/80">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-dark-surface px-3 py-1.5 rounded-xl border border-neutral-200/60 dark:border-dark-border">
            {order.id}
          </span>
          <span className="text-xs text-neutral-500">
            Placed on {order.date}
          </span>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Progress Timeline */}
      <div className="px-2">
        <OrderTracker currentStep={order.statusStep ?? 1} />
      </div>

      {/* Order Items Snapshot */}
      <div className="flex flex-col gap-3 pt-2">
        {order.items?.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
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

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-dark-border text-xs">
        <span className="text-neutral-500">
          Airway Bill: <strong className="font-mono text-neutral-900 dark:text-white">{order.trackingNumber}</strong>
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Total:</span>
            <strong className="font-mono text-sm text-brand-500 font-bold">
              {formatPrice(order.total)}
            </strong>
          </div>
          {onTrackDetails && (
            <button
              type="button"
              onClick={() => onTrackDetails(order)}
              className="flex items-center gap-1 text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors cursor-pointer ml-2"
            >
              <span>Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
