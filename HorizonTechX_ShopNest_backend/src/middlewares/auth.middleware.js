import jwt from 'jsonwebtoken';
import env from '../config/env.config.js';
import ApiError from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import userRepository from '../repositories/user.repository.js';

/**
 * Verify JWT Access Token from HTTP Header or Cookies
 */
export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '').trim();

  if (!token) {
    throw new ApiError(401, 'Unauthorized request: No access token provided');
  }

  try {
    const decodedToken = jwt.verify(token, env.JWT_SECRET);
    const user = await userRepository.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, 'Invalid access token: User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Access token has expired. Please refresh session.');
    }
    throw new ApiError(401, error?.message || 'Invalid access token');
  }
});

/**
 * Role-Based Access Control Middleware
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Access forbidden: Role '${req.user?.role || 'Guest'}' is not authorized to access this resource`
      );
    }
    next();
  };
};

export default {
  verifyJWT,
  authorizeRoles,
};
