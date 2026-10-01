import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import { ProgressiveImage } from '../ui/ProgressiveImage';


export const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const itemId = item.id || item._id;
  const itemTitle = item.title || item.name || 'Hardware Unit';
  const itemImage = item.image || item.thumbnail || (item.images && item.images[0]) || '';
  const itemPrice = Number(item.price) || 0;
  const itemQuantity = item.quantity || 1;

  return (
    <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border flex gap-3 sm:gap-4 items-center shadow-xs">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-neutral-100 dark:bg-dark-surface shrink-0 overflow-hidden border border-neutral-200/60 dark:border-dark-border">
        <ProgressiveImage
          src={itemImage}
          alt={itemTitle}
          width={160}
          aspectRatio="aspect-square"
          className="w-full h-full"
          imgClassName="w-full h-full object-cover object-center"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-0.5 sm:gap-1">
        <span className="text-[10px] font-mono uppercase text-brand-500 font-semibold truncate">
          {item.category || 'Hardware'}
        </span>
        <h4 className="font-display font-medium text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
          {itemTitle}
        </h4>
        <span className="font-mono text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">
          {formatPrice(itemPrice * itemQuantity)}
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="flex items-center border border-neutral-200 dark:border-dark-border rounded-lg bg-neutral-50 dark:bg-dark-surface">
          <button
            type="button"
            onClick={() => onUpdateQuantity(itemId, itemQuantity - 1)}
            disabled={itemQuantity <= 1}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:text-brand-500 disabled:opacity-30 cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-xs font-semibold px-1.5 sm:px-2">{itemQuantity}</span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(itemId, itemQuantity + 1)}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:text-brand-500 cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onRemove(itemId)}
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-neutral-400 hover:text-semantic-error rounded-lg cursor-pointer transition-colors"
          title="Remove"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
