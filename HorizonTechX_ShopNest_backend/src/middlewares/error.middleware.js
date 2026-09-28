import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';
import env from '../config/env.config.js';

// Global Error Handling Middleware
export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';

    // Mongoose bad ObjectId CastError
    if (error instanceof mongoose.Error.CastError) {
      statusCode = 400;
      message = `Resource not found with invalid id: ${error.value}`;
    }

    // Mongoose schema validation error
    else if (error instanceof mongoose.Error.ValidationError) {
      statusCode = 400;
      message = Object.values(error.errors)
        .map((val) => val.message)
        .join(', ');
    }

    // MongoDB duplicate key error (code 11000)
    else if (error.code === 11000) {
      statusCode = 409;
      const field = Object.keys(error.keyValue)[0];
      message = `Duplicate field value entered: '${field}' already exists.`;
    }

    // JWT errors
    else if (error.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid authentication token signature';
    } else if (error.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Authentication token has expired';
    }

    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors || [],
    ...(env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode).json(response);
};

export default errorHandler;
