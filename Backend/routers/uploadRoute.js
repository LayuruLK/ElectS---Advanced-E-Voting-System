// routes/uploadRoute.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = require('../helpers/cloudinaryStorage');

const upload = multer({ storage });

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  return res.status(200).json({
    message: 'Image uploaded successfully',
    url: req.file.path,
  });
});

module.exports = router;
