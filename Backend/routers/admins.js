const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const { User } = require('../models/user');
const { Candidate } = require('../models/candidate');
const { PoliticalParty } = require('../models/party');
const Service = require('../Services/GenericService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const name = 'Admin';

//Get All Admins
router.get('/', async(req,res)=> {
    try{
        const admins = await Admin.find();
        if (!admins || admins.length === 0) {
            return res.status(404).json({ error: 'No Admins Found'});
        }

        res.status(200).json({ message: 'Admins Retrieved Successfully', data:admins});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error'});
    }
});

//Get Admin By ID
router.get('/admin/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ error: 'Admin Not Found' });
        }
        res.status(200).json({ message: 'Admin Retrieved Successfully', data: admin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Add a New Admin
router.post('/', async (req, res) => {
    const { adminId, name, email, password, phone } = req.body;

    // Validate inputs
    if (!adminId || !name || !email || !password || !phone) {
        return res.status(400).json({ error: 'All fields (adminId, name, email, password, phone) are required' });
    }

    try {
        // Check if email already exists
        const emailExists = await Admin.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Check if adminId already exists
        const adminIdExists = await Admin.findOne({ adminId });
        if (adminIdExists) {
            return res.status(400).json({ error: 'Admin ID already exists' });
        }

        // Hash the password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (hashError) {
            console.error('Error hashing password:', hashError);
            return res.status(500).json({ error: 'Error hashing password' });
        }

        // Create a new admin
        const newAdmin = new Admin({
            adminId,
            name,
            email,
            password: hashedPassword,
            phone
        });

        // Save the new admin to the database
        await newAdmin.save();

        res.status(201).json({ message: 'Admin created successfully', data: newAdmin });
    } catch (error) {
        console.error('Error creating admin:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Validation error: Invalid input data' });
        }
        res.status(500).json({ error: 'Server error' });
    }
});
//Login Admin
router.post('/login', async (req, res) => {
    const privateKey = process.env.SECRET_KEY 
const { email, password } = req.body;

try { 
  // Check if email exists
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  // Compare the entered password with the hashed password
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  // Create a JWT token
  const payload = { adminId: admin.admin_id, email: admin.email, name:admin.name }; // The payload can include the user's ID or other relevant info
  const token = jwt.sign(payload, privateKey, { expiresIn: '1h' });

  // Return the token in the response
  res.status(200).json({
    message: 'Login successful',
    token,
    payload
  });
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Server error' });
}
});

//Update an Admin
router.put('/admin/:id', async (req, res) => {
    const { id } = req.params;
    const { admin_id, name, email, password, phone } = req.body;

    // Validate inputs
    if (!admin_id || !name || !email || !password || !phone) {
        return res.status(400).json({ error: 'All fields (admin_id, name, email, password, phone) are required' });
    }

    try {
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ error: 'Admin Not Found' });
        }

        // Update admin details
        admin.admin_id = admin_id || admin.admin_id;
        admin.name = name || admin.name;
        admin.email = email || admin.email;
        admin.password = password ? await bcrypt.hash(password, 10) : admin.password;
        admin.phone = phone || admin.phone;

        await admin.save();

        res.status(200).json({ message: 'Admin Updated Successfully', data: admin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

//Delete an Admin
router.delete('/admin/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ error: 'Admin Not Found' });
        }

        await admin.remove();
        res.status(200).json({ message: 'Admin Deleted Successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;

