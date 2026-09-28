import { Router } from 'express';
import productController from '../controllers/product.controller.js';
import { verifyJWT, authorizeRoles } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import {
  createProductValidator,
  updateProductValidator,
  queryProductValidator,
} from '../validators/product.validator.js';

const router = Router();

// Public product browsing endpoints
router.get('/', queryProductValidator, validate, productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/categories', productController.getCategories);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/:id', productController.getProductById);

// Admin-only product catalog mutation endpoints
router.post(
  '/',
  verifyJWT,
  authorizeRoles('admin'),
  createProductValidator,
  validate,
  productController.createProduct
);

router.put(
  '/:id',
  verifyJWT,
  authorizeRoles('admin'),
  updateProductValidator,
  validate,
  productController.updateProduct
);

router.delete(
  '/:id',
  verifyJWT,
  authorizeRoles('admin'),
  productController.deleteProduct
);

export default router;
