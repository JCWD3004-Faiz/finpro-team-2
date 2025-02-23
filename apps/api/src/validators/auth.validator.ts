import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';

export const validateLogin = validate([
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
]);