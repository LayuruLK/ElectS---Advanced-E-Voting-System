const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Function to send email
const sendEmail = async ({ to, subject, html, from = process.env.EMAIL_USER, fromName = 'E-Voting System' }) => {
    try {
        // Configure email options
        const mailOptions = {
            from: `"${fromName}" <${from}>`, // This format ensures both name and email appear
            to,
            subject,
            html
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = {
    sendEmail
}; 