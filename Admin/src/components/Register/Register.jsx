import React, { useState } from 'react';
import axios from 'axios';
import './AdminRegister.css'; 

const Register = () => {
  const [formData, setFormData] = useState({
    adminId: '', // New field for Admin ID
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const { adminId, name, email, password, phone } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/admins/admin', formData);
      alert('Admin registered successfully');
      console.log(response.data);
    } catch (error) {
      alert('Registration failed');
      console.error(error.response.data);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Admin Registration</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="adminId" className="form-label">Admin ID</label>
          <input
            type="text"
            id="adminId"
            name="adminId"
            value={adminId}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter Admin ID"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={phone}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter your phone number"
            required
          />
        </div>
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
};

export default Register;
