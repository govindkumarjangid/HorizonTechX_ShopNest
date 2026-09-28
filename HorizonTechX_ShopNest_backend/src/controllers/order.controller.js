import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import orderService from '../services/order.service.js';

export const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.user._id, req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, order, 'Order placed successfully'));
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const result = await orderService.getUserOrders(req.user._id, req.query);
  return res
    .status(200)
    .json(new ApiResponse(200, result, 'User orders retrieved successfully'));
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user._id, req.user.role);
  return res
    .status(200)
    .json(new ApiResponse(200, order, 'Order details retrieved successfully'));
});

export const updateStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, order, 'Order status updated successfully'));
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const result = await orderService.getAllOrders(req.query);
  return res
    .status(200)
    .json(new ApiResponse(200, result, 'All orders retrieved successfully'));
});

export default {
  createOrder,
  getMyOrders,
  getOrderById,
  updateStatus,
  getAllOrders,
};
