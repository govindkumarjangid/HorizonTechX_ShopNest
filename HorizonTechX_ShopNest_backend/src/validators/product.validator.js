import { body, query } from 'express-validator';

export const createProductValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('mrp')
    .notEmpty()
    .withMessage('MRP is required')
    .isFloat({ min: 0 })
    .withMessage('MRP must be a positive number'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('image')
    .notEmpty()
    .withMessage('Main image URL is required'),
];

export const updateProductValidator = [
  body('name').optional().trim(),
  body('description').optional().trim(),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('mrp').optional().isFloat({ min: 0 }).withMessage('MRP must be a positive number'),
  body('category').optional().trim(),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

export const queryProductValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('minPrice must be positive'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice must be positive'),
];

export default {
  createProductValidator,
  updateProductValidator,
  queryProductValidator,
};
