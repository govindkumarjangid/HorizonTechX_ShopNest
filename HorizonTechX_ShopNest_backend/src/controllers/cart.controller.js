import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import cartService from '../services/cart.service.js';

export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, cart, 'Cart retrieved successfully'));
});

export const addItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.addItemToCart(req.user._id, { productId, quantity });
  return res
    .status(200)
    .json(new ApiResponse(200, cart, 'Item added to bag'));
});

export const updateQuantity = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.updateItemQuantity(req.user._id, { productId, quantity });
  return res
    .status(200)
    .json(new ApiResponse(200, cart, 'Cart quantity updated'));
});

export const removeItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const cart = await cartService.removeItemFromCart(req.user._id, productId);
  return res
    .status(200)
    .json(new ApiResponse(200, cart, 'Item removed from bag'));
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearUserCart(req.user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, cart, 'Cart cleared successfully'));
});

export default {
  getCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
};
