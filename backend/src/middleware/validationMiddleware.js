const { body, validationResult } = require('express-validator');
const db = require('../config/db');

// Middleware to handle the result of the validation
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return a 400 Bad Request with the validation errors
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Define validation rules for user registration
const validateRegistration = [
  body('name', 'Name is required').not().isEmpty().trim().escape(),
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  validateRequest, // Run the validation check
];

// Define validation rules for user login
const validateLogin = [
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('password', 'Password is required').exists(),
  validateRequest,
];

// Define validation rules for updating a user profile
const validateProfileUpdate = [
  body('name').optional().not().isEmpty().withMessage('Name cannot be empty').trim().escape(),
  body('email').optional().isEmail().withMessage('Please include a valid email').normalizeEmail(),
  // Note: Password updates should typically be handled in a separate, dedicated route.
  validateRequest,
];

// Define validation rules for creating a product
const validateProductCreation = [
  body('name', 'Name is required').not().isEmpty().trim().escape(),
  body('price', 'Price must be a valid number').isFloat({ gt: 0 }),
  body('description', 'Description is required').not().isEmpty().trim().escape(),
  body('category_id', 'Category ID is required and must be an integer')
    .isInt({ gt: 0 })
    .custom(async (value) => {
      const { rows } = await db.query('SELECT id FROM categories WHERE id = $1', [value]);
      if (rows.length === 0) {
        return Promise.reject('Category does not exist');
      }
    }),
  body('count_in_stock', 'Count in stock must be a non-negative integer').isInt({ gte: 0 }),
  validateRequest,
];

// Define validation rules for updating a product
const validateProductUpdate = [
  body('name').optional().not().isEmpty().trim().escape(),
  body('price').optional().isFloat({ gt: 0 }),
  body('description').optional().not().isEmpty().trim().escape(),
  body('category_id')
    .optional()
    .isInt({ gt: 0 })
    .custom(async (value) => {
      const { rows } = await db.query('SELECT id FROM categories WHERE id = $1', [value]);
      if (rows.length === 0) {
        return Promise.reject('Category does not exist');
      }
    }),
  body('count_in_stock').optional().isInt({ gte: 0 }),
  validateRequest,
];

// Define validation rules for creating an order
const validateOrderCreation = [
  body('orderItems', 'Order items must be a non-empty array').isArray({ min: 1 }),
  body('orderItems.*.qty', 'Item quantity must be a positive integer').isInt({ gt: 0 }),
  body('orderItems.*.product_id', 'Each order item must have a valid product ID')
    .isInt({ gt: 0 })
    .custom(async (value) => {
      const { rows } = await db.query('SELECT id FROM products WHERE id = $1', [value]);
      if (rows.length === 0) {
        return Promise.reject(`Product with ID ${value} does not exist`);
      }
    }),
  body('shippingAddress.address', 'Shipping address is required').not().isEmpty().trim().escape(),
  body('shippingAddress.city', 'City is required').not().isEmpty().trim().escape(),
  body('shippingAddress.postalCode', 'Postal code is required').not().isEmpty().trim().escape(),
  body('shippingAddress.country', 'Country is required').not().isEmpty().trim().escape(),
  body('paymentMethod', 'Payment method is required').not().isEmpty().trim().escape(),
  body('totalPrice', 'Total price must be a valid number').isFloat({ gt: 0 }),
  validateRequest,
];

// Define validation rules for creating a product review
const validateReviewCreation = [
  body('rating', 'Rating must be a number between 1 and 5').isFloat({ min: 1, max: 5 }),
  body('comment', 'Comment is required').not().isEmpty().trim().escape(),
  // Custom validator to check if the user has already reviewed this product
  body('rating').custom(async (value, { req }) => {
    const productId = req.params.id;
    const userId = req.user.id; // Comes from the 'protect' middleware
    const { rows } = await db.query('SELECT * FROM reviews WHERE product_id = $1 AND user_id = $2', [productId, userId]);
    if (rows.length > 0) {
      return Promise.reject('You have already reviewed this product');
    }
  }),
  validateRequest,
];

// Define validation rules for the contact form
const validateContactForm = [
  body('name', 'Name is required').not().isEmpty().trim().escape(),
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('subject', 'Subject is required').not().isEmpty().trim().escape(),
  body('message', 'Message is required').not().isEmpty().trim().escape(),
  validateRequest,
];

module.exports = { validateRegistration, validateLogin, validateProfileUpdate, validateProductCreation, validateProductUpdate, validateOrderCreation, validateReviewCreation, validateContactForm };