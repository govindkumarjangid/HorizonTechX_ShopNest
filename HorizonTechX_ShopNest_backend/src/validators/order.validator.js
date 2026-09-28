import { body } from 'express-validator';

export const createOrderValidator = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least 1 item'),
  body('items.*.product')
    .notEmpty()
    .withMessage('Item product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID format'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('shippingAddress')
    .notEmpty()
    .withMessage('Shipping address is required'),
  body('shippingAddress.fullName')
    .trim()
    .notEmpty()
    .withMessage('Recipient name is required'),
  body('shippingAddress.phone')
    .trim()
    .notEmpty()
    .withMessage('Recipient phone number is required'),
  body('shippingAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('shippingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('shippingAddress.pincode')
    .trim()
    .notEmpty()
    .withMessage('PIN code is required'),
];

export const updateOrderStatusValidator = [
  body('orderStatus')
    .isIn(['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'])
    .withMessage('Invalid order status value'),
  body('statusStep')
    .optional()
    .isInt({ min: 0, max: 3 })
    .withMessage('Status step must be an integer between 0 and 3'),
];

export default {
  createOrderValidator,
  updateOrderStatusValidator,
};
