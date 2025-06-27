'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, AtSign, RectangleEllipsis, ArrowRight, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    setErrorMsg('');
    setSuccessMsg('');
  };

  const validateForm = () => {
    const newErrors = {};
    const { firstName, lastName, phoneNumber, email, password, confirmPassword } = formData;

    if (!firstName.trim()) newErrors.firstName = 'Please enter your first name';
    if (!lastName.trim()) newErrors.lastName = 'Please enter your last name';
    if (!phoneNumber.trim()) newErrors.phoneNumber = 'Please enter your phone number';
    else if (phoneNumber.length < 10) newErrors.phoneNumber = 'Please enter a valid phone number';

    if (!email.trim()) newErrors.email = 'Please enter your email address';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email';

    if (!password.trim()) newErrors.password = 'Please enter a password';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        setErrorMsg('Registration failed. Please try again.');
        return;
      }

      setSuccessMsg('Successfully registered!');
      router.push('/auth/login');
    } catch (err) {
      console.error('Error:', err);
      setErrorMsg('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, field, type = 'text', Icon) => (
    <div>
      <label className="block text-xl font-semibold text-gray-700 mb-3">
        <Icon className="inline w-5 h-5 mr-2" />
        {label}
      </label>
      <input
        type={type}
        value={formData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className={`w-full h-16 px-5 text-xl border-3 rounded-2xl focus:outline-none transition-all duration-200 ${
          errors[field]
            ? 'border-red-400 focus:border-red-500 bg-red-50'
            : 'border-gray-300 focus:border-blue-500 bg-white'
        }`}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
      {errors[field] && (
        <p className="text-red-600 text-lg mt-2 font-medium">{errors[field]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Create Your Account</h1>
          <p className="text-xl text-gray-600">Personal Information</p>
        </div>

        <div className="space-y-6">
          {renderInput('First Name', 'firstName', 'text', User)}
          {renderInput('Last Name', 'lastName', 'text', User)}
          {renderInput('Phone Number', 'phoneNumber', 'tel', Phone)}
          {renderInput('Email Address', 'email', 'email', AtSign)}
          {renderInput('Password', 'password', 'password', RectangleEllipsis)}
          {renderInput('Confirm Password', 'confirmPassword', 'password', RectangleEllipsis)}

          {errorMsg && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg border border-red-300 font-medium flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="bg-green-100 text-green-600 p-3 rounded-lg border border-green-300 font-medium">
              {successMsg}
            </div>
          )}

          <div className="flex justify-center">
            <p className="text-xl font-semibold text-gray-700">
              Already a User?{' '}
              <a className="text-blue-600 hover:underline font-semibold" href="/auth/login">
                Login
              </a>
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-18 bg-blue-600 text-white text-2xl font-bold rounded-2xl hover:bg-blue-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {loading ? 'Registering...' : 'Continue'}
              {!loading && <ArrowRight className="w-6 h-6 ml-3" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
