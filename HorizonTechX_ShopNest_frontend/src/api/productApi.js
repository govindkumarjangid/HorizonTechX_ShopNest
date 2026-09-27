import api from './axios';
import { products, categories } from '../assets/assets';

/**
 * Product & Catalog API Service
 */
export const productApi = {
  /**
   * Get all products with optional filters
   */
  getProducts: async (params = {}) => {
    try {
      return await api.get('/products', { params });
    } catch {
      let filtered = [...products];
      if (params.category && params.category !== 'All') {
        filtered = filtered.filter(
          (p) => p.category?.toLowerCase() === params.category.toLowerCase()
        );
      }
      if (params.search) {
        const query = params.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );
      }
      return { success: true, count: filtered.length, data: filtered };
    }
  },

  /**
   * Get single product by ID
   */
  getProductById: async (id) => {
    try {
      return await api.get(`/products/${id}`);
    } catch {
      const product = products.find((p) => p.id === id) || products[0];
      return { success: true, data: product };
    }
  },

  /**
   * Get product categories
   */
  getCategories: async () => {
    try {
      return await api.get('/categories');
    } catch {
      return { success: true, data: categories };
    }
  },

  /**
   * Get featured products for homepage
   */
  getFeaturedProducts: async () => {
    try {
      return await api.get('/products/featured');
    } catch {
      return { success: true, data: products.slice(0, 4) };
    }
  },
};

export default productApi;
