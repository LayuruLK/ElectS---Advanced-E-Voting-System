const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { User } = require('../models/user');
const AWS = require('aws-sdk');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { compareFaces } = require('../Services/compareFun');
require('dotenv').config();

// Configure AWS Rekognition
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const rekognition = new AWS.Rekognition();

// Set up multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50MB
}).single('photo');

// Create the router instance
const router = express.Router();

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ success: false, message: 'No token provided' });
  }

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    req.userId = decoded.userId;
    next();
  });
};

// Face Recognition Verification Endpoint
router.post('/facerecognition/verify', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: 'File too large. Max size is 50MB' });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const uploadedPhotoPath = req.file.path;
      const userId = req.body.userId;
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid or missing user ID' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (!user.realtimePhoto) {
        return res.status(400).json({ success: false, message: 'No valid real-time photo found for this user' });
      }

      // Fetch the user's photo from Cloudinary URL
      let userPhotoBuffer;

      if (user.realtimePhoto.startsWith('http://') || user.realtimePhoto.startsWith('https://')) {
        // It's a hosted URL
        const response = await axios.get(user.realtimePhoto, { responseType: 'arraybuffer' });
        userPhotoBuffer = Buffer.from(response.data);
      } else {
        // It's a local file path
        const photoPath = path.resolve(__dirname, '..', user.realtimePhoto); 
        userPhotoBuffer = fs.readFileSync(photoPath);
      }

      // Read the uploaded photo file
      const uploadedPhotoBuffer = fs.readFileSync(uploadedPhotoPath);

      // Perform facial recognition
      const faceComparisonResult = await compareFaces(userPhotoBuffer, uploadedPhotoBuffer);

      // Clean up: Delete the uploaded photo after processing
      await fs.promises.unlink(uploadedPhotoPath);

      // Respond based on the comparison result
      if (faceComparisonResult.success) {
        return res.status(200).json({ success: true, message: 'Face verification successful' });
      } else {
        return res.status(200).json({ success: false, message: 'Face verification failed' });
      }
    } catch (error) {
      console.error('Error during face verification:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
});

module.exports = router;
