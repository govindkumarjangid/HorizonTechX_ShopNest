import Order from '../models/Order.model.js';

export const createOrder = async (orderData) => {
  return await Order.create(orderData);
};

export const findById = async (id) => {
  return await Order.findById(id).populate('user', 'name email phone');
};

export const findByOrderId = async (orderId) => {
  return await Order.findOne({ orderId }).populate('user', 'name email phone');
};

export const findByUserId = async (userId, { skip = 0, limit = 10 } = {}) => {
  return await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

export const countByUserId = async (userId) => {
  return await Order.countDocuments({ user: userId });
};

export const updateOrderStatus = async (id, orderStatus, statusStep) => {
  const update = { orderStatus };
  if (statusStep !== undefined) update.statusStep = statusStep;

  if (orderStatus === 'Delivered') update.deliveredAt = new Date();

  return await Order.findByIdAndUpdate(
    id,
    { $set: update },
    { new: true, runValidators: true }
  );
};

export const findAllOrders = async ({ filter = {}, sort = { createdAt: -1 }, skip = 0, limit = 20 } = {}) => {
  return await Order.find(filter)
    .populate('user', 'name email phone')
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();
};

export const countOrders = async (filter = {}) => {
  return await Order.countDocuments(filter);
};

export default {
  createOrder,
  findById,
  findByOrderId,
  findByUserId,
  countByUserId,
  updateOrderStatus,
  findAllOrders,
  countOrders,
};
