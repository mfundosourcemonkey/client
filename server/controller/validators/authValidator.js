import { body, validationResult } from 'express-validator';

export const validateRegister = [
  body('fullName').isString().notEmpty().withMessage('Full name is required'),
  body('idNumber').isString().notEmpty().withMessage('ID number is required'),
  body('accountNumber').isString().notEmpty().withMessage('Account number is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];