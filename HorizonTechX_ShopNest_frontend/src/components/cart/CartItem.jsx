import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';

/**
 * Reusable Single Cart Row Item
 */
export const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border flex gap-4 items-center shadow-xs">
      <div className="w-20 h-20 rounded-xl bg-neutral-100 dark:bg-dark-surface shrink-0 overflow-hidden border border-neutral-200/60 dark:border-dark-border">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <span className="text-[10px] font-mono uppercase text-brand-500 font-semibold">
          {item.category || 'Hardware'}
        </span>
        <h4 className="font-display font-medium text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
          {item.title}
        </h4>
        <span className="font-mono text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">
          {formatPrice(item.price * (item.quantity || 1))}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center border border-neutral-200 dark:border-dark-border rounded-lg bg-neutral-50 dark:bg-dark-surface">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) - 1)}
            disabled={(item.quantity || 1) <= 1}
            className="p-1 hover:text-brand-500 disabled:opacity-30 cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-xs font-semibold px-2">{item.quantity || 1}</span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
            className="p-1 hover:text-brand-500 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="p-2 text-neutral-400 hover:text-semantic-error rounded-lg cursor-pointer"
          title="Remove"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
