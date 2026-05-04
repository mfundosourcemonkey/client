import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const PaymentSchema = Yup.object().shape({
  amount: Yup.number().min(1, 'Amount must be positive').required('Amount is required'),
  currency: Yup.string().required('Currency is required'),
  provider: Yup.string().required('Provider is required'),
  swiftCode: Yup.string()
    .matches(/^[A-Z0-9]{8,11}$/, 'Invalid SWIFT code')
    .required('SWIFT code is required'),
});

export default function CustomerDashboard() {
  const [payments, setPayments] = useState([]);
  const [status, setStatus] = useState(null);

  // Fetch payments on mount
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
//        const res = await axios.get('/api/payments/me', {
const res = await axios.get('http://localhost:5001/api/payments/me', {
  headers: { Authorization: `Bearer ${token}` },
});
        setPayments(res.data.payments);
      } catch (err) {
        setStatus('Failed to fetch payments');
      }
    };
    fetchPayments();
  }, []);

  // Handle new payment submission
  const handleCreatePayment = async (values, { setSubmitting, resetForm, setStatus }) => {
    setStatus(null);
    try {
      const token = localStorage.getItem('token');
//      await axios.post('/api/payments', values, {
await axios.post('http://localhost:5001/api/payments', values, {
  headers: { Authorization: `Bearer ${token}` },
});
      setStatus({ success: 'Payment created!' });
      resetForm();
      // Refresh payments
      const res = await axios.get('http://localhost:5001/api/payments/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(res.data.payments);
    } catch (err) {
      setStatus({ error: 'Failed to create payment' });
    }
    setSubmitting(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>Customer Dashboard</h2>
      <h3>Create Payment</h3>
      <Formik
        initialValues={{
          amount: '',
          currency: '',
          provider: '',
          swiftCode: '',
        }}
        validationSchema={PaymentSchema}
        onSubmit={handleCreatePayment}
      >
        {({ isSubmitting, status }) => (
          <Form>
            <div>
              <Field name="amount" type="number" placeholder="Amount" />
              <ErrorMessage name="amount" component="div" style={{ color: 'red' }} />
            </div>
            <div>
              <Field name="currency" placeholder="Currency (e.g., USD)" />
              <ErrorMessage name="currency" component="div" style={{ color: 'red' }} />
            </div>
            <div>
              <Field name="provider" placeholder="Provider" />
              <ErrorMessage name="provider" component="div" style={{ color: 'red' }} />
            </div>
            <div>
              <Field name="swiftCode" placeholder="SWIFT Code" />
              <ErrorMessage name="swiftCode" component="div" style={{ color: 'red' }} />
            </div>
            <button type="submit" disabled={isSubmitting}>Create Payment</button>
            {status?.error && <div style={{ color: 'red' }}>{status.error}</div>}
            {status?.success && <div style={{ color: 'green' }}>{status.success}</div>}
          </Form>
        )}
      </Formik>

      <h3 style={{ marginTop: 32 }}>Your Payments</h3>
      {status && typeof status === 'string' && <div style={{ color: 'red' }}>{status}</div>}
      <ul>
        {payments.map((p) => (
          <li key={p._id}>
            {p.amount} {p.currency} to {p.provider} (SWIFT: {p.swiftCode}) - Status: {p.status}
          </li>
        ))}
      </ul>
    </div>
  );
}