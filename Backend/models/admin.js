const mongoose = require('mongoose');

// Define the Admin schema
const adminSchema = new mongoose.Schema({
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
  role: {
    type: String,
    default: 'admin',
    enum: ['admin', 'superadmin'] 
  },
  electionsManaged: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Election'
    }
  ], // Array to store references to elections managed by the admin
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Admin model
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
