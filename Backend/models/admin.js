const mongoose = require('mongoose');

// Define the Admin schema
const adminSchema = new mongoose.Schema({
  adminId: {
    type: String,
    required: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
    
  }
  
  
});

// Create the Admin model
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
