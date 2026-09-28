import { Router } from 'express';
import orderController from '../controllers/order.controller.js';
import { verifyJWT, authorizeRoles } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import {
  createOrderValidator,
  updateOrderStatusValidator,
} from '../validators/order.validator.js';

const router = Router();

// Order placement and retrieval require authentication
router.post('/', verifyJWT, createOrderValidator, validate, orderController.createOrder);
router.get('/my-orders', verifyJWT, orderController.getMyOrders);
router.get('/:id', verifyJWT, orderController.getOrderById);

// Admin-only order management endpoints
router.get('/', verifyJWT, authorizeRoles('admin'), orderController.getAllOrders);
router.patch(
  '/:id/status',
  verifyJWT,
  authorizeRoles('admin'),
  updateOrderStatusValidator,
  validate,
  orderController.updateStatus
);

export default router;
