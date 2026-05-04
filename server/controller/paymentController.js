import Payment from '../models/Payment.js';
import User from '../models/User.js';

// 1. Create a payment (customer)
export async function createPayment(req, res) {
  try {
    const { amount, currency, provider, swiftCode } = req.body;
    const userId = req.user.userId; // req.user is set by auth middleware

    if (!amount || !currency || !provider || !swiftCode) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const payment = new Payment({
      userId,
      amount,
      currency,
      provider,
      swiftCode,
      status: 'pending'
    });

    await payment.save();
    res.status(201).json({ message: 'Payment created', payment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment' });
  }
}

// 2. View own payments (customer)
export async function getOwnPayments(req, res) {
  try {
    const userId = req.user.userId;
    const payments = await Payment.find({ userId });
    res.status(200).json({ payments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
}

// 3. View all payments (staff)
export async function getAllPayments(req, res) {
  try {
    // Optionally, check if req.user.role === 'staff' in your route/middleware
    const payments = await Payment.find().populate('userId', 'fullName accountNumber');
    res.status(200).json({ payments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all payments' });
  }
}

// 4. Verify/submit payment (staff)
export async function verifyPayment(req, res) {
  try {
    const paymentId = req.params.id;
    const { status } = req.body; // e.g., 'verified' or 'submitted'

    if (!['verified', 'submitted'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({ message: `Payment ${status}`, payment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment status' });
  }
}