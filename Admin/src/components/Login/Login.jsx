import React, { useState } from 'react';
import axios from 'axios';
import './loginStyle.css';
import { Link } from 'react-router-dom';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/admins/login', formData);
      localStorage.setItem('token', response.data.token);
      alert('Login successful');
      console.log(response.data);
    } catch (error) {
      alert('Login failed');
      console.error(error.response.data);
    }
  };

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
        <p>Don't have an account? <Link to="/register">Register Here</Link></p>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
