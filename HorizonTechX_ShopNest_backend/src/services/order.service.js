import ApiError from '../utils/ApiError.js';
import { getPagination, formatPaginationResponse } from '../utils/pagination.js';
import orderRepository from '../repositories/order.repository.js';
import productRepository from '../repositories/product.repository.js';
import cartRepository from '../repositories/cart.repository.js';

export const createOrder = async (userId, orderData) => {
  const { items, shippingAddress, paymentMethod = 'UPI' } = orderData;

  if (!items || items.length === 0)
    throw new ApiError(400, 'Cannot place order with zero items');

  // Validate items and verify live pricing & stock
  const validatedItems = [];
  let subtotal = 0;

  for (const item of items) {
    const productId = item.product?._id || item.product;
    const product = await productRepository.findById(productId);

    if (!product)
      throw new ApiError(404, `Product not found: ${productId}`);

    if (product.stock < item.quantity)
      throw new ApiError(
        400,
        `Insufficient stock for '${product.name}'. Requested: ${item.quantity}, Available: ${product.stock}`
      );

    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    validatedItems.push({
      product: product._id,
      title: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.image,
    });

    // Decrement stock
    await productRepository.updateById(product._id, {
      stock: product.stock - item.quantity,
      inStock: product.stock - item.quantity > 0,
    });
  }

  const shippingFee = subtotal >= 4999 ? 0 : 499;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shippingFee + tax;

  const order = await orderRepository.createOrder({
    user: userId,
    items: validatedItems,
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingFee,
    tax,
    total,
    orderStatus: 'Placed',
    statusStep: 0,
    isPaid: paymentMethod !== 'Cash on Delivery (COD)',
    paidAt: paymentMethod !== 'Cash on Delivery (COD)' ? new Date() : null,
  });

  // Empty cart upon successful placement
  await cartRepository.clearCart(userId);

  return order;
};

export const getUserOrders = async (userId, queryParams = {}) => {
  const { page, limit, skip } = getPagination(queryParams, 10, 50);

  const [orders, total] = await Promise.all([
    orderRepository.findByUserId(userId, { skip, limit }),
    orderRepository.countByUserId(userId),
  ]);

  return {
    orders,
    pagination: formatPaginationResponse(total, page, limit),
  };
};

export const getOrderById = async (identifier, userId, userRole = 'customer') => {
  let order;
  // Check if identifier is MongoDB ObjectId or custom human orderId (e.g. ORD-12345)
  if (identifier.startsWith('ORD-'))
    order = await orderRepository.findByOrderId(identifier);
  else
    order = await orderRepository.findById(identifier);


  if (!order)
    throw new ApiError(404, 'Order not found');


  const orderUserId = order.user?._id?.toString() || order.user?.toString();
  if (userRole !== 'admin' && orderUserId !== userId.toString())
    throw new ApiError(403, 'Unauthorized access to this order record');

  return order;
};

export const updateOrderStatus = async (orderId, { orderStatus, statusStep }) => {
  const stepMap = {
    Placed: 0,
    Processing: 1,
    Shipped: 2,
    Delivered: 3,
    Cancelled: 0,
  };

  const calculatedStep = statusStep !== undefined ? statusStep : stepMap[orderStatus] || 0;

  const updatedOrder = await orderRepository.updateOrderStatus(
    orderId,
    orderStatus,
    calculatedStep
  );

  if (!updatedOrder)
    throw new ApiError(404, 'Order not found to update status');

  return updatedOrder;
};

export const getAllOrders = async (queryParams = {}) => {
  const { page, limit, skip } = getPagination(queryParams, 20, 100);
  const filter = {};

  if (queryParams.status)
    filter.orderStatus = queryParams.status;

  const [orders, total] = await Promise.all([
    orderRepository.findAllOrders({ filter, skip, limit }),
    orderRepository.countOrders(filter),
  ]);

  return {
    orders,
    pagination: formatPaginationResponse(total, page, limit),
  };
};

export default {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
};
