import { body, validationResult } from 'express-validator';

// Validation middleware for creating a payment
export const validatePayment = [
  body('amount')
    .isFloat({ min: 1 })
    .withMessage('Amount must be a positive number'),
  body('currency')
    .isString()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be a 3-letter code')
    .trim()
    .escape(),
  body('provider')
    .isString()
    .notEmpty()
    .withMessage('Provider is required')
    .trim()
    .escape(),
  body('swiftCode')
    .matches(/^[A-Z0-9]{8,11}$/)
    .withMessage('Invalid SWIFT code')
    .trim()
    .escape(),
  // Handle validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];