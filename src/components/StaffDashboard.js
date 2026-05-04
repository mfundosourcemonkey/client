import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function StaffDashboard() {
  const [payments, setPayments] = useState([]);
  const [status, setStatus] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5001/api/payments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(res.data.payments);
      } catch (err) {
        setStatus('Failed to fetch payments');
      }
    };
    fetchPayments();
  }, []);

  const handleVerify = async (id) => {
    setStatus(null);
    console.log('Verifying payment with id:', id); // Debug log
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5001/api/payments/${id}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus('Payment verified!');
      // Refresh payments
      const res = await axios.get('http://localhost:5001/api/payments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(res.data.payments);
    } catch (err) {
      setStatus('Failed to verify payment');
    }
  };

  // Only allow staff
  if (!user || user.role !== 'staff') {
    return <div>Access denied.</div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto' }}>
      <h2>Staff Dashboard</h2>
      {status && <div>{status}</div>}
      <table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Currency</th>
            <th>Provider</th>
            <th>SWIFT</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => {
            console.log('Payment row:', p); // Debug log
            return (
              <tr key={p._id}>
                <td>{p.amount}</td>
                <td>{p.currency}</td>
                <td>{p.provider}</td>
                <td>{p.swiftCode}</td>
                <td>{p.status}</td>
                <td>
                  {p.status !== 'verified' && (
                    <button onClick={() => handleVerify(p._id)}>Verify</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}