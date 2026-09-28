import jwt from 'jsonwebtoken';
import env from '../config/env.config.js';
import ApiError from '../utils/ApiError.js';
import { generateAuthTokens, generateAccessToken } from '../utils/generateToken.js';
import userRepository from '../repositories/user.repository.js';

export const registerUser = async ({ name, email, password, role = 'customer' }) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser)
    throw new ApiError(409, 'An account with this email address already exists');

  const user = await userRepository.createUser({
    name,
    email,
    password,
    role,
  });

  const { accessToken, refreshToken } = generateAuthTokens(user);
  await userRepository.updateRefreshToken(user._id, refreshToken);

  const createdUser = await userRepository.findById(user._id);

  return { user: createdUser, accessToken, refreshToken };
};

export const loginUser = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email, true);
  if (!user)
    throw new ApiError(401, 'Invalid email or password credentials');

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid)
    throw new ApiError(401, 'Invalid email or password credentials');

  const { accessToken, refreshToken } = generateAuthTokens(user);
  await userRepository.updateRefreshToken(user._id, refreshToken);

  const loggedInUser = await userRepository.findById(user._id);

  return { user: loggedInUser, accessToken, refreshToken };
};

export const refreshAccessToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken)
    throw new ApiError(401, 'No refresh token provided');

  try {
    const decoded = jwt.verify(incomingRefreshToken, env.JWT_REFRESH_SECRET);
    const user = await userRepository.findById(decoded._id, true);

    if (!user || user.refreshToken !== incomingRefreshToken)
      throw new ApiError(401, 'Refresh token is invalid or has expired');

    const accessToken = generateAccessToken(user);
    return { accessToken };
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid refresh token signature');
  }
};

export const logoutUser = async (userId) => {
  await userRepository.updateRefreshToken(userId, null);
  return true;
};

export const getCurrentUser = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user)
    throw new ApiError(404, 'User account not found');
  return user;
};

export const updateUserProfile = async (userId, updateData) => {
  const allowedUpdates = ['name', 'phone', 'city', 'avatar'];
  const sanitizedUpdate = {};

  for (const key of allowedUpdates) {
    if (updateData[key] !== undefined) {
      sanitizedUpdate[key] = updateData[key];
    }
  }

  const updatedUser = await userRepository.updateById(userId, sanitizedUpdate);
  if (!updatedUser)
    throw new ApiError(404, 'User account not found');
  return updatedUser;
};

export const addUserAddress = async (userId, addressData) => {
  const user = await userRepository.addAddress(userId, addressData);
  if (!user)
    throw new ApiError(404, 'User account not found');
  return user.addresses;
};

export const removeUserAddress = async (userId, addressId) => {
  const user = await userRepository.removeAddress(userId, addressId);
  if (!user)
    throw new ApiError(404, 'User account not found');
  return user.addresses;
};

export const setDefaultAddress = async (userId, addressId) => {
  const user = await userRepository.setDefaultAddress(userId, addressId);
  if (!user)
    throw new ApiError(404, 'User account not found');
  return user.addresses;
};

export const toggleWishlist = async (userId, productId) => {
  const user = await userRepository.toggleWishlist(userId, productId);
  if (!user)
    throw new ApiError(404, 'User account not found');
  return user.wishlist;
};

export default {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
  updateUserProfile,
  addUserAddress,
  removeUserAddress,
  setDefaultAddress,
  toggleWishlist,
};
