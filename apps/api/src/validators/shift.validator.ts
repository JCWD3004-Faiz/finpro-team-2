import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';

export const validateStartShift = validate([
  body('initialCash')
    .notEmpty().withMessage('Initial cash amount is required')
    .isFloat({ min: 0 }).withMessage('Initial cash must be a positive number')
]);

export const validateEndShift = validate([
  body('finalCash')
    .notEmpty().withMessage('Final cash amount is required')
    .isFloat({ min: 0 }).withMessage('Final cash must be a positive number')
]);