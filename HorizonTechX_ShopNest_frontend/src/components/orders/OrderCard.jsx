import React from 'react';
import { ChevronRight } from 'lucide-react';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderTracker } from './OrderTracker';
import { formatPrice } from '../../utils/formatPrice';

/**
 * Reusable Order Summary Card with Tracking Timeline (Real Backend Compatible)
 */
export const OrderCard = ({ order, onTrackDetails }) => {
  const displayId = order.orderId || order.id || (order._id ? `ORD-${order._id.slice(-6).toUpperCase()}` : 'ORD-LIVE');
  const displayDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : (order.date || 'Recent');
  const displayStatus = order.orderStatus || order.status || 'Placed';
  const displayTotal = order.total || order.totalAmount || 0;
  const currentStep = order.statusStep !== undefined ? order.statusStep : (displayStatus === 'Delivered' ? 3 : (displayStatus === 'Shipped' ? 2 : (displayStatus === 'Processing' ? 1 : 0)));

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border shadow-subtle flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-dark-border/80">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-dark-surface px-3 py-1.5 rounded-xl border border-neutral-200/60 dark:border-dark-border">
            {displayId}
          </span>
          <span className="text-xs text-neutral-500">
            Placed on {displayDate}
          </span>
        </div>
        <OrderStatusBadge status={displayStatus} />
      </div>

      {/* Progress Timeline */}
      <div className="px-2">
        <OrderTracker currentStep={currentStep} />
      </div>

      {/* Order Items Snapshot */}
      <div className="flex flex-col gap-3 pt-2">
        {order.items?.map((item, idx) => {
          const itemTitle = item.title || item.name || item.product?.name || 'Hardware Unit';
          const itemImage = item.image || item.product?.image || (item.product?.images && item.product.images[0]) || '';
          const itemQty = item.quantity || 1;
          const itemPrice = item.price || 0;

          return (
            <div key={idx} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={itemImage}
                  alt={itemTitle}
                  loading="lazy"
                  className="w-12 h-12 rounded-xl object-cover border border-neutral-200 dark:border-dark-border"
                />
                <div>
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-white line-clamp-1">
                    {itemTitle}
                  </h4>
                  <span className="text-[11px] text-neutral-400">
                    Qty: {itemQty}
                  </span>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white">
                {formatPrice(itemPrice * itemQty)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-dark-border text-xs">
        <span className="text-neutral-500">
          Airway Bill: <strong className="font-mono text-neutral-900 dark:text-white">{order.trackingNumber || 'Pending Dispatch'}</strong>
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Total:</span>
            <strong className="font-mono text-sm text-brand-500 font-bold">
              {formatPrice(displayTotal)}
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
