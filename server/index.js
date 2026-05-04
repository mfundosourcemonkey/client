import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { validatePayment } from './controller/validators/paymentValidator.js';
import authMiddleware from './middleware/auth.js';

import { registerUser, loginUser } from './controller/authController.js';
import {
  createPayment,
  getOwnPayments,
  getAllPayments,
  verifyPayment
} from './controller/paymentController.js';
import { validateRegister } from './controller/validators/authValidator.js';
import { requireRole } from './middleware/role.js';

dotenv.config();
const dbUri = process.env.DB_URI;

mongoose.connect(dbUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Adjust as needed for production
  credentials: true
}));
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Auth routes
app.post('/api/auth/register', validateRegister, registerUser);
app.post('/api/auth/login', loginUser);

// Payment routes
app.post('/api/payments', authMiddleware, validatePayment, createPayment);
app.get('/api/payments/me', authMiddleware, getOwnPayments);
app.get('/api/payments', authMiddleware, requireRole('staff'), getAllPayments);
app.patch('/api/payments/:id/verify', authMiddleware, requireRole('staff'), verifyPayment);

app.get('/test-cors', (req, res) => {
  res.json({ message: 'CORS is working!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Secure Server running on port ${PORT}`));
