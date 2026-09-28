import Cart from '../models/Cart.model.js';

export const findByUserId = async (userId) => {
  return await Cart.findOne({ user: userId }).populate('items.product');
};

export const createCart = async (userId, items = []) => {
  return await Cart.create({ user: userId, items });
};

export const saveCart = async (cart) => {
  await cart.save();
  return await cart.populate('items.product');
};

export const clearCart = async (userId) => {
  return await Cart.findOneAndUpdate(
    { user: userId },
    { $set: { items: [] } },
    { new: true }
  );
};

export default {
  findByUserId,
  createCart,
  saveCart,
  clearCart,
};
