import { create } from 'zustand';
import { productApi } from '../api/productApi';

/**
 * Zustand Product & Catalog Store (Real Database Backend)
 * Connected directly to MongoDB Atlas product collection.
 */
export const useProductStore = create((set, get) => ({
  products: [],
  categories: [],
  featuredProducts: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  pagination: {
    totalDocs: 0,
    limit: 12,
    page: 1,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
  },

  // Active filters
  searchQuery: '',
  activeCategory: 'all',
  priceRange: [0, 100000],
  sortBy: 'featured', // 'featured' | 'price-low' | 'price-high' | 'rating'
  inStockOnly: false,
  page: 1,

  // Setters
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setSearchQuery: (query) => set({ searchQuery: query, page: 1 }),
  setActiveCategory: (categorySlug) => set({ activeCategory: categorySlug, page: 1 }),
  setPriceRange: (range) => set({ priceRange: range, page: 1 }),
  setSortBy: (sort) => set({ sortBy: sort, page: 1 }),
  setInStockOnly: (inStock) => set({ inStockOnly: inStock, page: 1 }),
  setPage: (newPage) => set({ page: newPage }),

  resetFilters: () => {
    set({
      searchQuery: '',
      activeCategory: 'all',
      priceRange: [0, 100000],
      sortBy: 'featured',
      inStockOnly: false,
      page: 1,
    });
    get().fetchProducts();
  },

  /**
   * Fetch products from real backend API with current active filters
   */
  fetchProducts: async (overrideParams = {}) => {
    const { searchQuery, activeCategory, priceRange, sortBy, inStockOnly, page } = get();

    const params = {
      page: overrideParams.page !== undefined ? overrideParams.page : page,
      limit: overrideParams.limit || 12,
      sort: overrideParams.sort || sortBy,
      ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
      ...(activeCategory && activeCategory !== 'all' ? { category: activeCategory } : {}),
      ...(priceRange[0] > 0 ? { minPrice: priceRange[0] } : {}),
      ...(priceRange[1] < 100000 ? { maxPrice: priceRange[1] } : {}),
      ...(inStockOnly ? { inStock: true } : {}),
      ...overrideParams,
    };

    set({ isLoading: true, error: null });

    try {
      const response = await productApi.getProducts(params);
      const data = response?.data || {};

      set({
        products: data.products || [],
        pagination: data.pagination || {
          totalDocs: (data.products || []).length,
          limit: params.limit,
          page: params.page,
          totalPages: 1,
          hasPrevPage: false,
          hasNextPage: false,
        },
        isLoading: false,
      });

      return data.products || [];
    } catch (err) {
      console.error('[useProductStore] fetchProducts error:', err);
      set({
        error: err.message || 'Failed to load products from database',
        isLoading: false,
      });
      return [];
    }
  },

  /**
   * Fetch all distinct categories from backend
   */
  fetchCategories: async () => {
    try {
      const response = await productApi.getCategories();
      const rawCategories = response?.data || [];

      // Format category slugs and display names
      const formatted = rawCategories.map((cat) => {
        if (typeof cat === 'string') {
          return {
            id: `cat-${cat}`,
            name: cat
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' '),
            slug: cat,
          };
        }
        return cat;
      });

      set({ categories: formatted });
      return formatted;
    } catch (err) {
      console.error('[useProductStore] fetchCategories error:', err);
      return [];
    }
  },

  /**
   * Fetch featured products for homepage showcase
   */
  fetchFeaturedProducts: async (limit = 8) => {
    try {
      const response = await productApi.getFeaturedProducts(limit);
      const items = response?.data || [];
      set({ featuredProducts: items });
      return items;
    } catch (err) {
      console.error('[useProductStore] fetchFeaturedProducts error:', err);
      return [];
    }
  },

  /**
   * Fetch single product by MongoDB ID or slug
   */
  fetchProductById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productApi.getProductById(id);
      const product = response?.data || null;
      set({ selectedProduct: product, isLoading: false });
      return product;
    } catch (err) {
      console.error('[useProductStore] fetchProductById error:', err);
      set({ error: err.message, isLoading: false });
      return null;
    }
  },

  /**
   * Selector helper for backward compatibility
   */
  getFilteredProducts: () => {
    return get().products;
  },
}));

export default useProductStore;
