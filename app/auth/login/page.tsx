'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AtSign, RectangleEllipsis, LogIn, AlertCircle } from 'lucide-react';
import Cookies from 'js-cookie';

const LoginPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    setErrorMsg('');
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Please enter your password';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.email, password: formData.password }),
      });

      if (!res.ok) {
        setErrorMsg('Invalid credentials. Please try again.');
        return;
      }

      const data = await res.json();
      Cookies.set('token', data.token);
      Cookies.set('userId', data.userId);

      router.push('/dashboard'); // basic redirect
    } catch (err) {
      console.error('Error logging in:', err);
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-xl text-gray-600">Login to your account</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xl font-semibold text-gray-700 mb-3">
              <AtSign className="inline w-5 h-5 mr-2" />
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full h-16 px-5 text-xl border-3 rounded-2xl focus:outline-none transition-all duration-200 ${
                errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
              }`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="text-red-600 text-lg mt-2 font-medium">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xl font-semibold text-gray-700 mb-3">
              <RectangleEllipsis className="inline w-5 h-5 mr-2" />
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full h-16 px-5 text-xl border-3 rounded-2xl focus:outline-none transition-all duration-200 ${
                errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-600 text-lg mt-2 font-medium">{errors.password}</p>
            )}
          </div>

          {errorMsg && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg border border-red-300 font-medium flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {errorMsg}
            </div>
          )}

          <div className="flex justify-center">
            <p className="text-xl font-semibold text-gray-700">
              Not a User?{' '}
              <a href="/auth/register" className="text-blue-600 hover:underline font-semibold">
                Register
              </a>
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-18 bg-blue-600 text-white text-2xl font-bold rounded-2xl hover:bg-blue-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {loading ? 'Logging in...' : 'Login'}
              {!loading && <LogIn className="w-6 h-6 ml-3" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
