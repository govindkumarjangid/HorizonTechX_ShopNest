import { Router } from 'express';
import cartController from '../controllers/cart.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// All cart operations require authentication
router.use(verifyJWT);

router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.put('/items', cartController.updateQuantity);
router.delete('/items/:productId', cartController.removeItem);
router.delete('/', cartController.clearCart);

export default router;
