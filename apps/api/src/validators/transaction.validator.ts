import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';
import { PaymentType } from '@prisma/client';

export const validateCreateTransaction = validate([
  body('shiftId')
    .notEmpty().withMessage('Shift ID is required')
    .isInt().withMessage('Shift ID must be an integer'),
  
  body('items')
    .isArray().withMessage('Items must be an array')
    .notEmpty().withMessage('Items cannot be empty'),
  
  body('items.*.productId')
    .isInt().withMessage('Product ID must be an integer'),
  
  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  
  body('paymentMethod')
    .isIn(Object.values(PaymentType)).withMessage('Invalid payment method'),
  
  body('debitCardNumber')
    .if(body('paymentMethod').equals(PaymentType.debit))
    .notEmpty().withMessage('Debit card number is required for debit payments')
    .isLength({ min: 16, max: 16 }).withMessage('Debit card number must be 16 digits')
    .matches(/^\d+$/).withMessage('Debit card number must contain only digits')
    .customSanitizer(value => value ? value.replace(/\s/g, '') : value) // Remove any spaces
]);