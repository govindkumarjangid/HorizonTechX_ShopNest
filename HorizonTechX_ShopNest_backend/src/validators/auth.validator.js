import { body } from 'express-validator';

export const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters'),
  body('phone')
    .optional()
    .trim(),
  body('city')
    .optional()
    .trim(),
];

export const addAddressValidator = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Recipient full name is required'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Recipient mobile phone is required')
    .isLength({ min: 10, max: 15 })
    .withMessage('Please provide a valid phone number (10-15 digits)'),
  body('street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('pincode')
    .trim()
    .notEmpty()
    .withMessage('PIN code is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('PIN code must be exactly 6 digits'),
];

export default {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  addAddressValidator,
};
