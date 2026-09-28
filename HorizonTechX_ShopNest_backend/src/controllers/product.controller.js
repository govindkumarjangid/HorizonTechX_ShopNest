import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import productService from '../services/product.service.js';

export const getProducts = asyncHandler(async (req, res) => {
  const result = await productService.getAllProducts(req.query);
  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Products retrieved successfully'));
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, product, 'Product details retrieved successfully'));
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await productService.getProductBySlug(req.params.slug);
  return res
    .status(200)
    .json(new ApiResponse(200, product, 'Product details retrieved successfully'));
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 8;
  const products = await productService.getFeaturedProducts(limit);
  return res
    .status(200)
    .json(new ApiResponse(200, products, 'Featured products retrieved successfully'));
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await productService.getAllCategories();
  return res
    .status(200)
    .json(new ApiResponse(200, categories, 'Categories retrieved successfully'));
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, product, 'Product created successfully'));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, product, 'Product updated successfully'));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Product deleted successfully'));
});

export default {
  getProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
};
