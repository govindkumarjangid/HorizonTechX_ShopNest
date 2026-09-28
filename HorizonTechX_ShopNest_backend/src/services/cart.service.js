import ApiError from '../utils/ApiError.js';
import cartRepository from '../repositories/cart.repository.js';
import productRepository from '../repositories/product.repository.js';

export const getCart = async (userId) => {
  let cart = await cartRepository.findByUserId(userId);
  if (!cart) {
    cart = await cartRepository.createCart(userId, []);
  }
  return cart;
};

export const addItemToCart = async (userId, { productId, quantity = 1 }) => {
  const product = await productRepository.findById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  if (product.stock < quantity) {
    throw new ApiError(400, `Insufficient stock available. Only ${product.stock} items left.`);
  }

  let cart = await cartRepository.findByUserId(userId);
  if (!cart) {
    cart = await cartRepository.createCart(userId, []);
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.product?._id?.toString() === productId.toString() || item.product?.toString() === productId.toString()
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += Number(quantity);
    cart.items[existingItemIndex].price = product.price;
  } else {
    cart.items.push({
      product: productId,
      quantity: Number(quantity),
      price: product.price,
    });
  }

  return await cartRepository.saveCart(cart);
};

export const updateItemQuantity = async (userId, { productId, quantity }) => {
  const qty = Number(quantity);
  const cart = await cartRepository.findByUserId(userId);
  if (!cart) {
    throw new ApiError(404, 'Cart not found');
  }

  if (qty <= 0) {
    cart.items = cart.items.filter(
      (item) => item.product?._id?.toString() !== productId.toString() && item.product?.toString() !== productId.toString()
    );
  } else {
    const itemIndex = cart.items.findIndex(
      (item) => item.product?._id?.toString() === productId.toString() || item.product?.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      throw new ApiError(404, 'Item not found in cart');
    }

    cart.items[itemIndex].quantity = qty;
  }

  return await cartRepository.saveCart(cart);
};

export const removeItemFromCart = async (userId, productId) => {
  const cart = await cartRepository.findByUserId(userId);
  if (!cart) {
    throw new ApiError(404, 'Cart not found');
  }

  cart.items = cart.items.filter(
    (item) => item.product?._id?.toString() !== productId.toString() && item.product?.toString() !== productId.toString()
  );

  return await cartRepository.saveCart(cart);
};

export const clearUserCart = async (userId) => {
  return await cartRepository.clearCart(userId);
};

export default {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearUserCart,
};
