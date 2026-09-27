import { create } from 'zustand';
import { products, categories } from '../assets/assets';

/**
 * Zustand Product & Catalog Store
 * Manages product listing, active filters, search query, sorting, and selected product
 */
export const useProductStore = create((set, get) => ({
  products: products,
  categories: categories,
  selectedProduct: products[0],
  searchQuery: '',
  activeCategory: 'all',
  priceRange: [0, 40000],
  sortBy: 'featured', // 'featured' | 'price-low' | 'price-high' | 'rating'
  inStockOnly: false,
  isLoading: false,

  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveCategory: (categorySlug) => set({ activeCategory: categorySlug }),
  setPriceRange: (range) => set({ priceRange: range }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setInStockOnly: (inStock) => set({ inStockOnly: inStock }),

  resetFilters: () =>
    set({
      searchQuery: '',
      activeCategory: 'all',
      priceRange: [0, 40000],
      sortBy: 'featured',
      inStockOnly: false,
    }),

  // Filtered & sorted product selector
  getFilteredProducts: () => {
    const { products, searchQuery, activeCategory, priceRange, sortBy, inStockOnly } = get();

    return products
      .filter((p) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          if (!matchTitle && !matchCategory && !matchDesc) return false;
        }

        // Category filter
        if (activeCategory !== 'all' && p.categorySlug !== activeCategory) {
          return false;
        }

        // Price range
        if (p.price < priceRange[0] || p.price > priceRange[1]) {
          return false;
        }

        // In-stock filter
        if (inStockOnly && !p.inStock) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0; // 'featured' (default order)
      });
  },
}));

export default useProductStore;
