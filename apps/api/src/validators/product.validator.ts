import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';

export const validateCreateProduct = validate([
  body('name').notEmpty().withMessage('Name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock')
    .notEmpty().withMessage('Stock is required')
    .isInt({ min: 0 }).withMessage('Stock must be a positive integer'),
  body('imageUrl')
    .optional()
    .isURL().withMessage('Image URL must be a valid URL')
]);

export const validateUpdateProduct = validate([
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty'),
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('imageUrl')
    .optional()
    .isURL().withMessage('Image URL must be a valid URL')
]);

export const validateUpdateStock = validate([
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt().withMessage('Quantity must be an integer')
]);