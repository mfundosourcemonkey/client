import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_API_URL;

const RegisterSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  idNumber: Yup.string().required('ID number is required'),
  accountNumber: Yup.string().required('Account number is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  role: Yup.string().oneOf(['customer', 'staff']).required('Role is required'),
});

export default function Register() {
  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', textAlign: 'center' }}>
      <h2>Register</h2>
      <Formik
        initialValues={{
          fullName: '',
          idNumber: '',
          accountNumber: '',
          password: '',
          role: 'customer',
        }}
        validationSchema={RegisterSchema}
        onSubmit={async (values, { setSubmitting, setStatus, resetForm }) => {
          setStatus(null);
          try {
            await axios.post(`${apiUrl}/auth/register`, values);
            setStatus({ success: 'Registration successful! Please log in.' });
            resetForm();
          } catch (error) {
            setStatus({
              error:
                error.response?.data?.message ||
                'Registration failed. Please try again.',
            });
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, status }) => (
          <Form>
            <div style={{ marginBottom: 16 }}>
              <Field name="fullName" placeholder="Full Name" />
              <ErrorMessage name="fullName" component="div" style={{ color: 'red' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Field name="idNumber" placeholder="ID Number" />
              <ErrorMessage name="idNumber" component="div" style={{ color: 'red' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Field name="accountNumber" placeholder="Account Number" />
              <ErrorMessage name="accountNumber" component="div" style={{ color: 'red' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Field name="password" type="password" placeholder="Password" />
              <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Field as="select" name="role">
                <option value="customer">Customer</option>
                <option value="staff">Staff</option>
              </Field>
              <ErrorMessage name="role" component="div" style={{ color: 'red' }} />
            </div>
            <button type="submit" disabled={isSubmitting}>
              Register
            </button>
            {status?.error && <div style={{ color: 'red', marginTop: 8 }}>{status.error}</div>}
            {status?.success && <div style={{ color: 'green', marginTop: 8 }}>{status.success}</div>}
          </Form>
        )}
      </Formik>
      <p style={{ marginTop: 16 }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}