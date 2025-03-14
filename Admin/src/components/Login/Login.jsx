import React, { useState } from 'react';
import axios from 'axios';
import './loginStyle.css';
import { Link, Navigate } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [redirect, setRedirect] = useState(false); // State to manage redirection

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/admins/login`, formData);
      localStorage.setItem('token', response.data.token);
      alert('Login successful');
      setRedirect(true); // Set redirect to true upon successful login
    } catch (error) {
      alert('Login failed');
      console.error(error.response.data);
    }
  };

  // Redirect to home if login is successful
  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="admin-login-container">
      <h2 className="admin-login-title">Admin Login</h2>
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Email"
          className="admin-login-input"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="Password"
          className="admin-login-input"
          required
        />
        <button type="submit" className="admin-login-button">Login</button>
        
        <div className="admin-login-register-link">
          <p><Link to="/register">Register Here</Link></p>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;