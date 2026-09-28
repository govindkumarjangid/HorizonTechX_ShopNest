import jwt from 'jsonwebtoken';
import env from '../config/env.config.js';

/**
 * Generate Access Token with short expiration
 */
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    }
  );
};

/**
 * Generate Refresh Token with extended expiration
 */
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    }
  );
};

/**
 * Generate both Access and Refresh tokens
 */
export const generateAuthTokens = (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { accessToken, refreshToken };
};

export default {
  generateAccessToken,
  generateRefreshToken,
  generateAuthTokens,
};
