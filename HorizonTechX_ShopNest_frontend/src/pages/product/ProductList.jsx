import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';
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
    getFilteredProducts,
    isLoading,
  } = useProductStore();

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [searchParams, setActiveCategory]);

  const addItem = useCartStore((state) => state.addItem);
  const filteredProducts = getFilteredProducts();

  const handleProductClick = (product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
    }
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (product) => {
    addItem(product, 1);
    notify.success(`${product.title} added to your bag!`);
  };

  const handleToggleWishlist = (product) => {
    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
    notify.success(`${product.title} updated in Wishlist!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 mb-8 sm:mb-10">
        <div className="flex items-center gap-2">
          <Badge variant="brand" icon={Sparkles} size="sm">
            Curated Hardware Archive
          </Badge>
        </div>
        <H1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
          All Precision <span className="text-brand-500">Instruments</span>
        </H1>
        <Subtitle className="text-sm sm:text-base max-w-2xl">
          Explore machined mechanical tools, audiophile acoustic transducers, and minimalist horology.
        </Subtitle>
      </div>

      {/* Controls Bar (Mobile Filter Toggle + Sort Dropdown) */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border shadow-xs mb-8">
        {/* Mobile Filter Button */}
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-dark-surface text-xs font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-brand-500" />
          <span>Filters</span>
          {(activeCategory !== 'All' || inStockOnly || priceRange[0] > 0 || priceRange[1] < 100000) && (
            <span className="w-2 h-2 rounded-full bg-brand-500" />
          )}
        </button>

        {/* Results Counter */}
        <span className="text-xs text-neutral-500 hidden sm:inline-block font-mono">
          Showing <strong>{filteredProducts.length}</strong> verified instruments
        </span>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Sort:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-dark-surface border border-neutral-200 dark:border-dark-border text-xs font-semibold text-neutral-800 dark:text-neutral-200 outline-none cursor-pointer"
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
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24">
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
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="
                relative w-full max-h-[85vh] overflow-y-auto
                bg-white dark:bg-dark-surface
                rounded-t-3xl shadow-2xl z-10 p-6 flex flex-col gap-4
              "
            >
              <div className="w-12 h-1.5 rounded-full bg-neutral-300 dark:bg-dark-border mx-auto -mt-2 mb-2" />
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-dark-border">
                <span className="font-display font-bold text-base text-neutral-900 dark:text-white">
                  Filter Catalog
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

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
                className="border-0 p-0 shadow-none"
              />

              <Button
                size="lg"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full mt-2 cursor-pointer"
              >
                Apply Filters ({filteredProducts.length} Results)
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductList;
