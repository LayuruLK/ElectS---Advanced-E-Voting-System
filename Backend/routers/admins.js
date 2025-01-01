const express = require('express');
const router = express.Router();
const { Admin } = require('../models/admin');
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

//Add a New Admin
router.post('/', async (req, res) => {
    const { admin_id, name, email, password, phone } = req.body;
    
    // Validate inputs
    if (!admin_id || !name || !email || !password || !phone) {
        return res.status(400).json({ error: 'All fields (admin_id, name, email, password, phone) are required' });
    }


    try {
        // Check if email already exists
        const emailExists = await Admin.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ error: 'Email Already Exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin
        const newAdmin = new Admin({
            admin_id,
            name,
            email,
            password: hashedPassword,
            phone
        });

        await newAdmin.save();
        res.status(201).json({ message: 'Admin Created Successfully', data: newAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

//Login Admin
router.post('/login', async (req, res) => {
    const privateKey = process.env.JWT_SECRET 
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


module.exports = router;

