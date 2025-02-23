import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';

export const validateCreateCashier = validate([
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
]);

export const validateUpdateCashier = validate([
  body('username')
    .optional()
    .notEmpty().withMessage('Username cannot be empty')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  
  body('password')
    .optional()
    .notEmpty().withMessage('Password cannot be empty')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
]);