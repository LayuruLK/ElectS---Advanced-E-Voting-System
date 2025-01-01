const cron = require('node-cron');
const nodemailer = require('nodemailer');
const { User } = require('../models/user');

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASSWORD 
    }
});



// Email content
const sendEmail = async (email, name) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Update Your Real-time Photo',
            text: `Dear ${name},\n\nYour real-time photo has expired! Please re-upload it to continue using the voting system.\n\nThank you,\nVoting System Team`
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send email to ${email}:`, error.message);
    }
};

// Schedule the task
cron.schedule('* * * * *', async () => {    //correct one is '0 0 * * *'
    try {
        // Get current date
        const currentDate = new Date();

        // Find users whose photo was last updated over a year ago
        const users = await User.find({
            photoUpdatedAt: { $lte: new Date(currentDate.setFullYear(currentDate.getFullYear() - 1)) }
        });

        // Send email reminders to users
        for (const user of users) {
            await sendEmail(user.email, user.firstName);
        }
    } catch (error) {
        console.error('Error in photo update scheduler:', error.message);
    }
});

module.exports = { sendEmail };
