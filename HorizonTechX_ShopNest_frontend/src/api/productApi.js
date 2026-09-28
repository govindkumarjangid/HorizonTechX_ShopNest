import api from './axios';

/**
 * Product & Catalog API Service (Real Backend MongoDB Atlas)
 * No mock fallbacks: Direct integration with HorizonTechX ShopNest Backend.
 */
export const productApi = {
  /**
   * Get all products with query filters (search, category, sort, minPrice, maxPrice, inStock, page, limit)
   */
  getProducts: async (params = {}) => {
    return await api.get('/products', { params });
  },

  /**
   * Get single product by ID
   */
  getProductById: async (id) => {
    return await api.get(`/products/${id}`);
  },

  /**
   * Get single product by SEO slug
   */
  getProductBySlug: async (slug) => {
    return await api.get(`/products/slug/${slug}`);
  },

  /**
   * Get all product categories list
   */
  getCategories: async () => {
    return await api.get('/products/categories');
  },

  /**
   * Get featured products for homepage
   */
  getFeaturedProducts: async (limit = 8) => {
    return await api.get('/products/featured', { params: { limit } });
  },
};

export default productApi;
