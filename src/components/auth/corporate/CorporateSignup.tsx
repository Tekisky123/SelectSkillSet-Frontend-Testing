import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CorporateSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // Add signup logic here for corporate signup
  };

  return (
    <div className="min-h-screen bg-[#F3F2EF] flex flex-col justify-center items-center py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-8">Corporate Signup</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-2"
              placeholder="Your company name"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">Contact Person</label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-2"
              placeholder="Your name"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-2"
              placeholder="company@domain.com"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-2"
              placeholder="Enter your password"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-2"
              placeholder="+123456789"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>
        <div className="text-center mt-6">
          <p>
            Already have an account?{' '}
            <span
              onClick={() => navigate('/corporate-login')}
              className="text-blue-500 cursor-pointer"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
