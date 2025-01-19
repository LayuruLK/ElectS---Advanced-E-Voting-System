const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { User } = require("../models/user.js");
const express = require("express");

const router = express.Router();

router.post("/forgotpassword", async (req, res) => {
  const { nicNo, email } = req.body;

  // Validate request data
  if (!nicNo || !email) {
    return res.status(400).json({ message: "NIC number and email are required" });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ nic: nicNo, email });
    if (!user) {
      return res.status(404).json({ message: "User not found. Please check your NIC number and email." });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Set up email options
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Password Recovery",
      text: `Hello ${user.firstName},\n\nYou requested to reset your password. Click the link below to reset it:\n\n${process.env.CLIENT_URL}/setpassword?token=${token}\n\nIf you did not request this, please ignore this email.`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Respond with success message
    res.status(200).json({ message: "Recovery email sent successfully. Please check your inbox." });
  } catch (err) {
    // Check for specific error types and handle accordingly
    if (err.name === "MongoError") {
      console.error("Database error:", err.message);
      return res.status(500).json({ message: "Database error occurred. Please try again later." });
    } else if (err.name === "JsonWebTokenError") {
      console.error("JWT error:", err.message);
      return res.status(500).json({ message: "Error generating token. Please try again later." });
    } else if (err.response && err.response.data) {
      console.error("Email error:", err.response.data);
      return res.status(500).json({ message: "Failed to send recovery email. Please verify your email settings." });
    } else {
      console.error("Unexpected error:", err.message);
      return res.status(500).json({ message: "An unexpected server error occurred. Please try again later." });
    }
  }
});


router.post("/reset", async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: "Token and new password are required" });
  }
  
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Find the user by ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password and update the user's password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.passwordHash = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      // Token-related error handling
      return res.status(400).json({ message: "Invalid token" });
    } else if (err instanceof jwt.TokenExpiredError) {
      // Token expired error handling
      return res.status(400).json({ message: "Token expired" });
    } else {
      // Generic error handling
      console.error(err);
      return res.status(500).json({ message: "Server error, please try again later" });
    }
  }
});


module.exports = router;