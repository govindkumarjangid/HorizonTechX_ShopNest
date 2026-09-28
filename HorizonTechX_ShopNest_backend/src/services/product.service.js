import ApiError from '../utils/ApiError.js';
import { getPagination, formatPaginationResponse } from '../utils/pagination.js';
import productRepository from '../repositories/product.repository.js';

export const getAllProducts = async (queryParams) => {
  const { page, limit, skip } = getPagination(queryParams, 12, 100);

  const filter = {};

  // Category filter
  if (queryParams.category && queryParams.category !== 'All') {
    filter.category = { $regex: new RegExp(`^${queryParams.category}$`, 'i') };
  }

  // Brand filter
  if (queryParams.brand) {
    filter.brand = { $regex: new RegExp(`^${queryParams.brand}$`, 'i') };
  }

  // Price range filter
  if (queryParams.minPrice || queryParams.maxPrice) {
    filter.price = {};
    if (queryParams.minPrice) filter.price.$gte = Number(queryParams.minPrice);
    if (queryParams.maxPrice) filter.price.$lte = Number(queryParams.maxPrice);
  }

  // Stock status filter
  if (queryParams.inStock === 'true' || queryParams.inStock === true) {
    filter.inStock = true;
    filter.stock = { $gt: 0 };
  }

  // Featured filter
  if (queryParams.featured === 'true' || queryParams.featured === true) {
    filter.isFeatured = true;
  }

  // Search keyword filter (text search or regex fallback)
  if (queryParams.search?.trim()) {
    const searchRegex = new RegExp(queryParams.search.trim(), 'i');
    filter.$or = [
      { name: searchRegex },
      { title: searchRegex },
      { description: searchRegex },
      { brand: searchRegex },
      { category: searchRegex },
      { tags: searchRegex },
    ];
  }

  // Sorting
  let sort = { createdAt: -1 };
  if (queryParams.sort) {
    switch (queryParams.sort) {
      case 'price-low':
      case 'price_asc':
        sort = { price: 1 };
        break;
      case 'price-high':
      case 'price_desc':
        sort = { price: -1 };
        break;
      case 'rating':
        sort = { rating: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'featured':
        sort = { isFeatured: -1, createdAt: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }
  }

  const [products, total] = await Promise.all([
    productRepository.findProducts({ filter, sort, skip, limit }),
    productRepository.countProducts(filter),
  ]);

  return {
    products,
    pagination: formatPaginationResponse(total, page, limit),
  };
};

export const getProductById = async (id) => {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found with specified ID');
  }
  return product;
};

export const getProductBySlug = async (slug) => {
  const product = await productRepository.findBySlug(slug);
  if (!product) {
    throw new ApiError(404, 'Product not found with specified slug');
  }
  return product;
};

export const getFeaturedProducts = async (limit = 8) => {
  return await productRepository.findFeatured(limit);
};

export const getAllCategories = async () => {
  return await productRepository.getDistinctCategories();
};

export const createProduct = async (productData) => {
  return await productRepository.createProduct(productData);
};

export const updateProduct = async (id, updateData) => {
  const product = await productRepository.updateById(id, updateData);
  if (!product) {
    throw new ApiError(404, 'Product not found to update');
  }
  return product;
};

export const deleteProduct = async (id) => {
  const product = await productRepository.deleteById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found to delete');
  }
  return product;
};

export default {
  getAllProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getAllCategories,
  createProduct,
  updateProduct,
  deleteProduct,
};
