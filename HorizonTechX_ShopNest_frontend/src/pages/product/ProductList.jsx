import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, X, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { H1, Subtitle, Button, Badge } from '../../components/ui';
import { ProductFilters } from '../../components/products/ProductFilters';
import { ProductGrid } from '../../components/products/ProductGrid';
import { useProductStore } from '../../store/useProductStore';
import { useCartStore } from '../../store/useCartStore';
import { notify } from '../../utils/notify';

/**
 * Product Listing Page (PLP)
 * Features mobile bottom-sheet filter drawer, sorting dropdown, and synchronized product grid
 */
export const ProductList = ({ onSelectProduct, onAddToWishlist }) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    products,
    categories,
    activeCategory,
    setActiveCategory,
    priceRange,
    setPriceRange,
    inStockOnly,
    setInStockOnly,
    sortBy,
    setSortBy,
    resetFilters,
    fetchProducts,
    fetchCategories,
    isLoading,
  } = useProductStore();

  const [debouncedPriceRange, setDebouncedPriceRange] = useState(priceRange);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categoryParam !== activeCategory) {
      setActiveCategory(categoryParam);
    }
  }, [searchParams, activeCategory, setActiveCategory]);

  // Debounce price slider updates to prevent spamming backend API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
    }, 350);
    return () => clearTimeout(timer);
  }, [priceRange]);

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, debouncedPriceRange, inStockOnly, sortBy, fetchProducts]);

  const addItem = useCartStore((state) => state.addItem);
  const filteredProducts = products;

  const handleProductClick = (product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
    }
    const prodId = typeof product === 'string' ? product : (product?._id || product?.id);
    if (prodId) {
      navigate(`/product/${prodId}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddToCart = (product) => {
    addItem(product, 1);
    const prodTitle = product.name || product.title;
    notify.success(`${prodTitle} added to your bag!`);
  };

  const handleToggleWishlist = (product) => {
    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
    const prodTitle = product.name || product.title;
    notify.success(`${prodTitle} updated in Wishlist!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-10 w-full">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 mb-8 sm:mb-10">
        <div className="flex items-center gap-2">
          <Badge variant="brand" icon={LayoutGrid} size="sm">
            Curated Store Collection
          </Badge>
        </div>
        <H1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Explore All <span className="text-brand-500">Products</span>
        </H1>
        <Subtitle className="text-sm sm:text-base max-w-2xl">
          Discover our premium selection of computing, smartphones, audio gear, and lifestyle essentials.
        </Subtitle>
      </div>

      {/* Controls Bar: Only Sort Dropdown (and mobile filter button) */}
      <div className="flex items-center justify-between sm:justify-end gap-3 mb-6">
        {/* Mobile Filter Button */}
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border text-xs font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer shadow-xs"
        >
          <SlidersHorizontal className="w-4 h-4 text-brand-500" />
          <span>Filters</span>
          {(activeCategory !== 'All' || inStockOnly || priceRange[0] > 0 || priceRange[1] < 100000) && (
            <span className="w-2 h-2 rounded-full bg-brand-500" />
          )}
        </button>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Sort:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border text-xs font-semibold text-neutral-800 dark:text-neutral-200 outline-none cursor-pointer shadow-xs focus:border-brand-500"
          >
            <option value="featured">Featured First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Main Layout (Filters Sidebar + Products Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters (Sticky Top) */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24 self-start z-20">
          <ProductFilters
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            inStockOnly={inStockOnly}
            onInStockChange={setInStockOnly}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onResetFilters={resetFilters}
          />
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-9 w-full">
          <ProductGrid
            products={filteredProducts}
            isLoading={isLoading}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleToggleWishlist}
            onQuickView={handleProductClick}
            onResetFilters={resetFilters}
            columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          />
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex items-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-neutral-950/65 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="
                relative w-full h-[94vh] sm:h-auto sm:max-h-[88vh]
                bg-white dark:bg-dark-surface
                rounded-t-3xl shadow-2xl z-10 flex flex-col overflow-hidden
              "
            >
              {/* Sticky Top Header */}
              <div className="shrink-0 px-5 pt-3 pb-3 border-b border-neutral-100 dark:border-dark-border bg-white dark:bg-dark-surface">
                <div className="w-10 h-1 rounded-full bg-neutral-300 dark:bg-dark-border mx-auto mb-2" />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-base text-neutral-900 dark:text-white">
                      Filter Catalog
                    </h3>
                    <span className="text-[11px] text-neutral-500">
                      {filteredProducts.length} curations matching
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-dark-card cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Filter Options Body */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
                <ProductFilters
                  categories={categories}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                  priceRange={priceRange}
                  onPriceChange={setPriceRange}
                  inStockOnly={inStockOnly}
                  onInStockChange={setInStockOnly}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  onResetFilters={resetFilters}
                  className="border-0 p-0 shadow-none bg-transparent dark:bg-transparent"
                />
              </div>

              {/* Sticky Bottom Apply Button */}
              <div className="shrink-0 p-4 border-t border-neutral-100 dark:border-dark-border bg-white/95 dark:bg-dark-surface/95 backdrop-blur-md pb-[max(1rem,env(safe-area-inset-bottom))]">
                <Button
                  size="lg"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full shadow-subtle cursor-pointer"
                >
                  Apply Filters ({filteredProducts.length} Results)
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductList;
