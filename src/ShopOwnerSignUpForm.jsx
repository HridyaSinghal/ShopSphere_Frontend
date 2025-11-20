
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUpForm.css';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const ShopOwnerSignUpForm = () => {
  const [form, setForm] = useState({
    name: '',
    shopName: '',
    phoneNo: '',
    emailId: '',
    password: '',
    address: '',
    area: '', // Added area field
    retailerEmail: '',
  });

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

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://shopspherebackend.up.railway.app/shopowner/signup', {
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
    <div className="signup-container">
      
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="shopName">Shop Name</label>
          <input type="text" id="shopName" name="shopName" value={form.shopName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNo">Phone Number</label>
          <input type="tel" id="phoneNo" name="phoneNo" value={form.phoneNo} onChange={handleChange} required pattern="[0-9]{10}" maxLength={10} />
        </div>

        <div className="form-group">
          <label htmlFor="emailId">Email</label>
          <input type="email" id="emailId" name="emailId" value={form.emailId} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address (Street / Landmark)</label>
          <textarea id="address" name="address" value={form.address} onChange={handleChange} required rows={2} />
        </div>

        {/* <div className="form-group">
          <label htmlFor="area">Select Area (Delhi)</label>
          <select
            id="area"
            name="area"
            value={form.area}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">-- Select Area --</option>
            {delhiAreas.map((area, index) => (
              <option key={index} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div> */}

        <div className="form-group">
          <label htmlFor="retailerEmail">Retailer Email (for low stock alerts)</label>
          <input type="email" id="retailerEmail" name="retailerEmail" value={form.retailerEmail} onChange={handleChange} required />
        </div>

        <button type="submit" className="signup-btn">Sign Up</button>
      </form>
    </div>
  );
};

export default ShopOwnerSignUpForm;
