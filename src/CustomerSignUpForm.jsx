

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';


const CustomerSignUpForm = () => {
  const [form, setForm] = useState({
    name: '',
    phoneNo: '',
    emailId: '',
    password: '',
    address: '',
    area: '', // <-- Added area field
  });

  const navigate = useNavigate();

  // const delhiAreas = [
  //   "Connaught Place",
  //   "Karol Bagh",
  //   "Chandni Chowk",
  //   "Saket",
  //   "Dwarka",
  //   "Rohini",
  //   "Janakpuri",
  //   "Vasant Kunj",
  //   "Lajpat Nagar",
  //   "South Extension",
  //   "Pitampura",
  //   "Preet Vihar",
  //   "Rajouri Garden",
  //   "Mayur Vihar",
  //   "New Friends Colony",
  // ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://shopspherebackend.up.railway.app/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        alert('Sign up successful!');
        navigate('/');
      } else {
        const errorText = await response.text();
        alert('Sign up failed: ' + errorText);
      }
    } catch (error) {
      alert('Sign up failed: ' + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-5"
      >
      

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="name">Name</label>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="phoneNo">Phone Number</label>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="tel"
            id="phoneNo"
            name="phoneNo"
            value={form.phoneNo}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            maxLength={10}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="emailId">Email</label>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="email"
            id="emailId"
            name="emailId"
            value={form.emailId}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="password">Password</label>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />
      
          <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="address">Street Address</label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            rows={2}
          />
        </div>

        {/* <div>
          <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="area">Select Area (Delhi)</label>
          <select
            id="area"
            name="area"
            value={form.area}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">-- Select Area --</option>
            {delhiAreas.map((area, index) => (
              <option key={index} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div> */}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default CustomerSignUpForm;
