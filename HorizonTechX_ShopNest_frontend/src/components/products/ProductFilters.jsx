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
  priceRange = [0, 40000],
  onPriceChange,
  inStockOnly = false,
  onInStockChange,
  onResetFilters,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-6 p-6 rounded-3xl bg-white dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border shadow-subtle ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-dark-border">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-500" />
          <h3 className="font-display font-bold text-base text-neutral-900 dark:text-white">
            Filter Archive
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
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
          Hardware Divisions
        </label>
        <div className="flex flex-col gap-1">
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
            <span>All Curations</span>
            {activeCategory === 'all' && <Check className="w-3.5 h-3.5" />}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.slug)}
              className={`
                w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer
                ${activeCategory === cat.slug
                  ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-dark-surface'
                }
              `}
            >
              <span>{cat.name}</span>
              <span className="text-[10px] text-neutral-400 font-mono">
                {cat.itemCount}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Price Range Slider */}
      <div className="flex flex-col gap-3 pt-4 border-t border-neutral-100 dark:border-dark-border">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
            Max Price
          </label>
          <span className="font-mono text-xs font-bold text-brand-500">
            {formatPrice(priceRange[1])}
          </span>
        </div>
        <input
          type="range"
          min="5000"
          max="40000"
          step="1000"
          value={priceRange[1]}
          onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-brand-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-neutral-400">
          <span>₹5,000</span>
          <span>₹40,000</span>
        </div>
      </div>

      {/* 3. Availability Toggle */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-dark-border">
        <label className="text-xs font-bold text-neutral-900 dark:text-white cursor-pointer select-none">
          Immediate Dispatch Only
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
