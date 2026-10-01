import api from './axios';

export const productApi = {
  // get all products
  getProducts: async (params = {}) => {
    return await api.get('/products', { params });
  },

  // get single product by ID
  getProductById: async (id) => {
    return await api.get(`/products/${id}`);
  },

  // Get single product by slug
  getProductBySlug: async (slug) => {
    return await api.get(`/products/slug/${slug}`);
  },

  // get all product categories
  getCategories: async () => {
    return await api.get('/products/categories');
  },

  // get all product brands
  getFeaturedProducts: async (limit = 8) => {
    return await api.get('/products/featured', { params: { limit } });
  },
};

export default productApi;