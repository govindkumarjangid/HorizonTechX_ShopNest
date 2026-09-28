import React from 'react';
import { Filter, RotateCcw, Check } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';

/**
 * Filter Sidebar & Drawer Controls for PLP
 */
export const ProductFilters = ({
  categories = [],
  activeCategory = 'all',
  onCategoryChange,
  priceRange = [0, 100000],
  onPriceChange,
  inStockOnly = false,
  onInStockChange,
  onResetFilters,
  className = '',
}) => {
  const [localMaxPrice, setLocalMaxPrice] = React.useState(priceRange[1] || 100000);

  React.useEffect(() => {
    setLocalMaxPrice(priceRange[1]);
  }, [priceRange]);

  const handleSliderChange = (e) => {
    const newVal = Number(e.target.value);
    setLocalMaxPrice(newVal);
    if (onPriceChange) {
      onPriceChange([priceRange[0], newVal]);
    }
  };

  return (
    <div className={`flex flex-col gap-6 p-6 rounded-3xl bg-white dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border shadow-subtle max-h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-dark-border">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-500" />
          <h3 className="font-display font-bold text-base text-neutral-900 dark:text-white">
            Filter Products
          </h3>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs font-semibold text-neutral-500 hover:text-brand-500 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Categories */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
            Categories
          </label>
          <span className="text-[11px] text-neutral-400 font-mono">
            {categories.length} Topics
          </span>
        </div>
        <div className="flex flex-col gap-1 max-h-[360px] overflow-y-auto pr-1 select-none">
          <button
            type="button"
            onClick={() => onCategoryChange('all')}
            className={`
              w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer
              ${activeCategory === 'all'
                ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-dark-surface'
              }
            `}
          >
            <span>All Categories</span>
            {activeCategory === 'all' ? (
              <Check className="w-3.5 h-3.5 text-brand-500" />
            ) : (
              <span className="text-[10px] text-neutral-400 font-mono">
                {categories.reduce((acc, c) => acc + (c.itemCount || 0), 0) || 194}
              </span>
            )}
          </button>
          {categories.map((cat) => {
            const catSlug = cat.slug || (typeof cat === 'string' ? cat : cat.id);
            const catName = cat.name || (typeof cat === 'string' ? cat : cat.slug);
            const isSelected = activeCategory?.toLowerCase() === catSlug?.toLowerCase();

            return (
              <button
                key={cat.id || catSlug}
                type="button"
                onClick={() => onCategoryChange(catSlug)}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer
                  ${isSelected
                    ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 font-bold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-dark-surface'
                  }
                `}
              >
                <span className="truncate pr-2">{catName}</span>
                {isSelected ? (
                  <Check className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                ) : cat.itemCount ? (
                  <span className="text-[10px] text-neutral-400 font-mono shrink-0">
                    {cat.itemCount}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Price Range Slider */}
      <div className="flex flex-col gap-3 pt-4 border-t border-neutral-100 dark:border-dark-border">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
            Maximum Price
          </label>
          <span className="font-mono text-xs font-bold text-brand-500">
            {formatPrice(localMaxPrice)}
          </span>
        </div>
        <input
          type="range"
          min="500"
          max="100000"
          step="500"
          value={localMaxPrice}
          onChange={handleSliderChange}
          className="w-full accent-brand-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-neutral-400">
          <span>₹500</span>
          <span>₹1,00,000+</span>
        </div>
      </div>

      {/* 3. Availability Toggle */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-dark-border">
        <label className="text-xs font-bold text-neutral-900 dark:text-white cursor-pointer select-none">
          In Stock Only
        </label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockChange(e.target.checked)}
          className="w-4 h-4 rounded text-brand-500 accent-brand-500 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ProductFilters;
