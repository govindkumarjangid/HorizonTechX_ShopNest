import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  ArrowRight,
  TrendingUp,
  Tag,
  PackageX,
  Loader2,
} from 'lucide-react';
import { productApi } from '../../api/productApi';
import { useProductStore } from '../../store/useProductStore';
import { formatPrice } from '../../utils/formatPrice';

/**
 * Premium Autocomplete Search Bar
 * Features real-time backend API search, category matching, trending queries,
 * keyboard navigation (arrows/enter/escape), and mobile full-width responsive overlay.
 */
export const AutocompleteSearch = ({
  placeholder = 'Search premium products, brands, or collections...',
  className = '',
  onCloseMobileSearch,
  onActiveChange,
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Notify parent component about active/expanded state for smooth navbar expansion
  useEffect(() => {
    onActiveChange?.(isOpen);
  }, [isOpen, onActiveChange]);

  const categories = useProductStore((state) => state.categories);

  const trendingQueries = [
    'Audio',
    'Laptops',
    'Watches',
    'Decoration',
    'Accessories',
  ];

  // Live debounced search against MongoDB Atlas
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await productApi.getProducts({ search: q, limit: 6 });
        const items = response?.data?.products || [];
        setSearchResults(items);
      } catch (err) {
        console.warn('[AutocompleteSearch] Query failed:', err.message);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Matching categories from store
  const matchingCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !categories) return [];

    return categories.filter((c) => {
      const name = typeof c === 'string' ? c : c.name;
      const slug = typeof c === 'string' ? c : c.slug;
      return name?.toLowerCase().includes(q) || slug?.toLowerCase().includes(q);
    }).slice(0, 3);
  }, [query, categories]);

  // Click outside listener to dismiss suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    const totalSuggestions = searchResults.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < totalSuggestions - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalSuggestions - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        handleSelectProduct(searchResults[selectedIndex]);
      } else {
        handleExecuteSearch(query);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelectProduct = (product) => {
    setIsOpen(false);
    setQuery('');
    if (onCloseMobileSearch) onCloseMobileSearch();
    const prodId = product._id || product.id;
    navigate(`/product/${prodId}`);
  };

  const handleSelectCategory = (cat) => {
    setIsOpen(false);
    setQuery('');
    if (onCloseMobileSearch) onCloseMobileSearch();
    const catSlug = typeof cat === 'string' ? cat : (cat.slug || cat.name?.toLowerCase());
    navigate(`/shop?category=${encodeURIComponent(catSlug)}`);
  };

  const handleExecuteSearch = (searchQuery) => {
    const trimmed = searchQuery.trim();
    setIsOpen(false);
    if (onCloseMobileSearch) onCloseMobileSearch();
    if (trimmed) {
      navigate(`/shop?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/shop');
    }
  };

  const handleClear = () => {
    setQuery('');
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Box */}
      <div className="relative flex items-center w-full group">
        <Search className="absolute left-3.5 w-4 h-4 text-neutral-400 group-focus-within:text-brand-500 transition-colors pointer-events-none" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className="
            w-full bg-neutral-100 dark:bg-dark-card
            border border-neutral-200/50 dark:border-dark-border
            focus:border-brand-500/60 focus:bg-white dark:focus:bg-dark-surface
            text-neutral-900 dark:text-dark-text
            text-xs sm:text-sm rounded-2xl pl-10 pr-12 py-2.5 outline-none
            placeholder:text-neutral-400 dark:placeholder:text-neutral-500
            transition-all duration-200 shadow-xs focus:shadow-subtle focus:ring-2 focus:ring-brand-500/10
          "
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1.5 text-neutral-400 hover:text-neutral-800 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Clear search input"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Desktop Shortcut Badge */}
        {!query && (
          <kbd className="hidden sm:inline-flex items-center absolute right-3 px-1.5 py-0.5 text-[10px] font-mono font-medium text-neutral-400 dark:text-neutral-500 bg-white dark:bg-dark-surface border border-neutral-200 dark:border-dark-border rounded-md shadow-xs pointer-events-none">
            ⌘K
          </kbd>
        )}
      </div>

      {/* Autocomplete Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="
              absolute left-0 right-0 top-full mt-2 z-50
              bg-white/95 dark:bg-dark-surface/95 backdrop-blur-2xl
              border border-neutral-200/90 dark:border-dark-border
              rounded-2xl shadow-2xl overflow-hidden
              max-h-[75vh] sm:max-h-96 flex flex-col overscroll-contain
            "
          >
            {/* Case A: Query is Empty - Show Trending & Categories */}
            {!query.trim() && (
              <div
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
                className="p-4 flex flex-col gap-4 overflow-y-auto overscroll-contain"
              >
                {/* Trending Queries */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5 mb-2.5">
                    <TrendingUp className="w-3.5 h-3.5 text-brand-500" />
                    Trending Searches
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {trendingQueries.map((tQuery, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setQuery(tQuery);
                          handleExecuteSearch(tQuery);
                        }}
                        className="text-xs px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-dark-card hover:bg-brand-50 dark:hover:bg-brand-950/40 hover:text-brand-500 text-neutral-700 dark:text-neutral-300 font-medium transition-colors cursor-pointer text-left"
                      >
                        {tQuery}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Categories */}
                <div className="pt-3 border-t border-neutral-100 dark:border-dark-border/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5 mb-2">
                    <Tag className="w-3.5 h-3.5 text-brand-500" />
                    Popular Categories
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.slice(0, 4).map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectCategory(cat)}
                        className="flex items-center gap-2 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-dark-card transition-colors text-left cursor-pointer"
                      >
                        <span className="w-2 h-2 rounded-full bg-brand-500" />
                        <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                          {cat.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Case B: Query is Active with Results */}
            {query.trim() && searchResults.length > 0 && (
              <div
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
                className="flex flex-col overflow-y-auto overscroll-contain"
              >
                {/* Matching Category Shortcuts */}
                {matchingCategories.length > 0 && (
                  <div className="px-4 py-2.5 bg-neutral-50 dark:bg-dark-card/60 border-b border-neutral-100 dark:border-dark-border flex items-center gap-2 flex-wrap text-xs">
                    <span className="text-neutral-400 font-medium text-[11px]">In Category:</span>
                    {matchingCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectCategory(cat)}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-dark-surface border border-neutral-200 dark:border-dark-border text-brand-600 dark:text-brand-400 font-semibold hover:border-brand-500 transition-colors cursor-pointer"
                      >
                        {cat.name} &rarr;
                      </button>
                    ))}
                  </div>
                )}

                {/* Products List */}
                <div className="p-2 flex flex-col gap-1">
                  <span className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Products ({searchResults.length})
                  </span>
                  {searchResults.map((product, idx) => {
                    const isSelected = selectedIndex === idx;
                    const prodId = product._id || product.id;
                    const prodTitle = product.name || product.title;
                    const prodImage = product.image || (product.images && product.images[0]) || '';

                    return (
                      <button
                        key={prodId}
                        type="button"
                        onClick={() => handleSelectProduct(product)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`
                          w-full flex items-center justify-between p-2.5 rounded-xl
                          transition-all cursor-pointer text-left
                          ${
                            isSelected
                              ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400'
                              : 'hover:bg-neutral-100 dark:hover:bg-dark-card text-neutral-900 dark:text-white'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Thumbnail */}
                          <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-dark-surface overflow-hidden shrink-0 border border-neutral-200/60 dark:border-dark-border">
                            {prodImage ? (
                              <img
                                src={prodImage}
                                alt={prodTitle}
                                className="w-full h-full object-cover object-center"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-neutral-200 dark:bg-dark-surface text-neutral-400 text-[10px]">
                                Item
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold truncate leading-tight">
                              {prodTitle}
                            </span>
                            <span className="text-[10px] text-neutral-400 capitalize mt-0.5">
                              {product.category} {product.brand ? `• ${product.brand}` : ''}
                            </span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="shrink-0 pl-3 text-right">
                          <span className="font-mono text-xs font-bold text-brand-500">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Footer View All Results */}
                <button
                  type="button"
                  onClick={() => handleExecuteSearch(query)}
                  className="
                    px-4 py-3 border-t border-neutral-100 dark:border-dark-border
                    bg-neutral-50 dark:bg-dark-card
                    flex items-center justify-between
                    text-xs font-semibold text-brand-600 dark:text-brand-400
                    hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors cursor-pointer
                  "
                >
                  <span className="flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-brand-500" />
                    <span>View all products for &ldquo;{query}&rdquo;</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Case C: Query is Active with No Results */}
            {query.trim() && searchResults.length === 0 && (
              <div className="p-6 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-dark-card flex items-center justify-center text-neutral-400">
                  <PackageX className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                    No products found
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mt-1">
                    No products match &ldquo;{query}&rdquo;. Check spelling or explore our store catalog.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setQuery('');
                    if (onCloseMobileSearch) onCloseMobileSearch();
                    navigate('/shop');
                  }}
                  className="mt-1 px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-semibold shadow-subtle hover:bg-brand-600 transition-colors cursor-pointer"
                >
                  Browse Store Catalog
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AutocompleteSearch;
