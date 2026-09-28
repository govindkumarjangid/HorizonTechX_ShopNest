import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

/**
 * Express-validator Result Interceptor Middleware
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map((err) => ({
    field: err.path || err.param,
    message: err.msg,
  }));

  throw new ApiError(
    422,
    extractedErrors[0]?.message || 'Input validation failed',
    extractedErrors
  );
};

export default validate;
