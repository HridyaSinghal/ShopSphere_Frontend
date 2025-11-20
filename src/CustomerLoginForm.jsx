import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUpForm.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Helper function to decode JWT
function parseJwt(token) {
  if (!token) return {};
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return {};
  }
}

const CustomerLoginForm = () => {
  const [form, setForm] = useState({
    emailId: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.jwt) {
          localStorage.setItem('userToken', data.jwt);
          // Try to set userName from response, else decode from JWT
          if (data.name) {
            localStorage.setItem('userName', data.name);
          } else {
            const jwtPayload = parseJwt(data.jwt);
            if (jwtPayload && jwtPayload.userName) {
              localStorage.setItem('userName', jwtPayload.userName);
            }
          }
          if (data.roles) localStorage.setItem('userRole', data.roles);
        }
        alert('Login successful!');
        navigate('/all-shops');
      } else {
        const errorText = await response.text();
        alert('Login failed: ' + errorText);
      }
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Customer Login</h2>
        <div className="form-group">
          <label htmlFor="emailId">Email</label>
          <input type="email" id="emailId" name="emailId" value={form.emailId} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />
        </div>
        <button type="submit" className="signup-btn">Login</button>
      </form>
    </div>
  );
};

export default CustomerLoginForm; 