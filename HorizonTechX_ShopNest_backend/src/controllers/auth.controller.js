import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import authService from '../services/auth.service.js';
import env from '../config/env.config.js';

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const result = await authService.registerUser({ name, email, password, role });

  return res
    .status(201)
    .cookie('refreshToken', result.refreshToken, cookieOptions)
    .json(new ApiResponse(201, result, 'User registered successfully'));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });

  return res
    .status(200)
    .cookie('refreshToken', result.refreshToken, cookieOptions)
    .json(new ApiResponse(200, result, 'Login successful'));
});

export const refreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  const result = await authService.refreshAccessToken(incomingRefreshToken);

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Access token refreshed successfully'));
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user?._id)
    await authService.logoutUser(req.user._id);

  return res
    .status(200)
    .clearCookie('refreshToken', cookieOptions)
    .json(new ApiResponse(200, null, 'Logged out successfully'));
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user._id);
  return res.status(200).json(new ApiResponse(200, user, 'Profile fetched successfully'));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await authService.updateUserProfile(req.user._id, req.body);
  return res.status(200).json(new ApiResponse(200, updatedUser, 'Profile updated successfully'));
});

export const addAddress = asyncHandler(async (req, res) => {
  const addresses = await authService.addUserAddress(req.user._id, req.body);
  return res.status(201).json(new ApiResponse(201, addresses, 'Address added successfully'));
});

export const removeAddress = asyncHandler(async (req, res) => {
  const addresses = await authService.removeUserAddress(req.user._id, req.params.addressId);
  return res.status(200).json(new ApiResponse(200, addresses, 'Address removed successfully'));
});

export const setDefaultAddress = asyncHandler(async (req, res) => {
  const addresses = await authService.setDefaultAddress(req.user._id, req.params.addressId);
  return res.status(200).json(new ApiResponse(200, addresses, 'Default address updated successfully'));
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const wishlist = await authService.toggleWishlist(req.user._id, req.params.productId);
  return res.status(200).json(new ApiResponse(200, wishlist, 'Wishlist updated successfully'));
});

export default {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  addAddress,
  removeAddress,
  setDefaultAddress,
  toggleWishlist,
};
