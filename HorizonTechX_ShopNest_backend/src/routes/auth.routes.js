import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  addAddressValidator,
} from '../validators/auth.validator.js';

const router = Router();

// Public auth endpoints
router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.post('/refresh', authController.refreshToken);

// Protected user profile & preferences endpoints
router.post('/logout', verifyJWT, authController.logout);
router.get('/me', verifyJWT, authController.getProfile);
router.put('/me', verifyJWT, updateProfileValidator, validate, authController.updateProfile);

// Address book endpoints
router.post('/addresses', verifyJWT, addAddressValidator, validate, authController.addAddress);
router.delete('/addresses/:addressId', verifyJWT, authController.removeAddress);
router.patch('/addresses/:addressId/default', verifyJWT, authController.setDefaultAddress);

// Wishlist toggle endpoint
router.post('/wishlist/:productId', verifyJWT, authController.toggleWishlist);

export default router;
