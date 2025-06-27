'use client';

import React, { useState } from 'react';
import { User, Phone, ArrowRight,AtSign,RectangleEllipsis } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    email: '',
    password:''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Please enter your first name';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Please enter your last name';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Please enter your phone number';
    } else if (formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (!formData.email.trim()) {
    newErrors.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
    newErrors.password = 'Please enter a password';
    } else if (formData.password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters long'; 
    }   


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted:', formData);
    }
  };

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
          <div>
            <label className="block text-xl font-semibold text-gray-700 mb-3">
              <User className="inline w-5 h-5 mr-2" />
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`w-full h-16 px-5 text-xl border-3 rounded-2xl focus:outline-none transition-all duration-200 ${
                errors.firstName 
                  ? 'border-red-400 focus:border-red-500 bg-red-50' 
                  : 'border-gray-300 focus:border-blue-500 bg-white'
              }`}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="text-red-600 text-lg mt-2 font-medium">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-xl font-semibold text-gray-700 mb-3">
              <User className="inline w-5 h-5 mr-2" />
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`w-full h-16 px-5 text-xl border-3 rounded-2xl focus:outline-none transition-all duration-200 ${
                errors.lastName 
                  ? 'border-red-400 focus:border-red-500 bg-red-50' 
                  : 'border-gray-300 focus:border-blue-500 bg-white'
              }`}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="text-red-600 text-lg mt-2 font-medium">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label className="block text-xl font-semibold text-gray-700 mb-3">
              <Phone className="inline w-5 h-5 mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className={`w-full h-16 px-5 text-xl border-3 rounded-2xl focus:outline-none transition-all duration-200 ${
                errors.phoneNumber 
                  ? 'border-red-400 focus:border-red-500 bg-red-50' 
                  : 'border-gray-300 focus:border-blue-500 bg-white'
              }`}
              placeholder="Enter your phone number"
            />
            {errors.phoneNumber && (
              <p className="text-red-600 text-lg mt-2 font-medium">{errors.phoneNumber}</p>
            )}
          </div>

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
                    errors.email
                        ? 'border-red-400 focus:border-red-500 bg-red-50'
                        : 'border-gray-300 focus:border-blue-500 bg-white'
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
                    errors.password
                        ? 'border-red-400 focus:border-red-500 bg-red-50'
                        : 'border-gray-300 focus:border-blue-500 bg-white'
                    }`}
                    placeholder="Enter your password"
                />
                {errors.password && (
                    <p className="text-red-600 text-lg mt-2 font-medium">{errors.password}</p>
                )}
            </div>
            
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              className="w-full h-18 bg-blue-600 text-white text-2xl font-bold rounded-2xl hover:bg-blue-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Continue 
              <ArrowRight className="w-6 h-6 ml-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;