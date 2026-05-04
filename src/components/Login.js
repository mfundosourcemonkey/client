import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const apiUrl = process.env.REACT_APP_API_URL;

const LoginSchema = Yup.object().shape({
  accountNumber: Yup.string().required('Account number is required'),
  password: Yup.string().required('Password is required'),
});

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', textAlign: 'center' }}>
      <h2>Login</h2>
      <Formik
        initialValues={{
          accountNumber: '',
          password: '',
        }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          setStatus(null);
          try {
            const res = await axios.post(`${apiUrl}/auth/login`, values);
            login(res.data.token, res.data.user.role);
            // Redirect based on role
            if (res.data.user.role === 'staff') {
              navigate('/staff-dashboard');
            } else {
              navigate('/customer-dashboard');
            }
          } catch (error) {
            setStatus({
              error:
                error.response?.data?.message ||
                'Login failed. Please try again.',
            });
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, status }) => (
          <Form>
            <div style={{ marginBottom: 16 }}>
              <Field name="accountNumber" placeholder="Account Number" />
              <ErrorMessage name="accountNumber" component="div" style={{ color: 'red' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Field name="password" type="password" placeholder="Password" />
              <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
            </div>
            <button type="submit" disabled={isSubmitting}>
              Login
            </button>
            {status?.error && <div style={{ color: 'red', marginTop: 8 }}>{status.error}</div>}
          </Form>
        )}
      </Formik>
      <p style={{ marginTop: 16 }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}