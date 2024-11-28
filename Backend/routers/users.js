const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const {Candidate} = require('../models/candidate');
const Service = require('../Services/GenericService');
const upload = require('../helpers/upload');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const name = 'User'

//Get users
router.get('/', async(req,res) => {
    Service.getAll(res, User, name).catch((error) => {
        res.status(500).send(error+ " Server Error")
    })  
})

//Get User By id
router.get('/profile/:id', async(req,res) =>{
    Service.getById(req, res, User, name).catch((error) =>{
        res.status(500).send(error+ " Server Error")
    })
})

//Delete an User
router.delete('/:id',(req,res)=>{
    Service.deleteById(req,res,User,name).catch((error) => {
        res.status(500).send(error+" Server Error")
    })
})


//getCount
router.get('/get/count', (req,res) => {
    Service.getCount(res, User, name).catch((error) => {
        res.status(500).send(error+ " Server Error")
    })  
})

//Post new user
router.post('/register', upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'nicFront', maxCount: 1 },
    { name: 'nicBack', maxCount: 1 },
    { name: 'realtimePhoto', maxCount: 1 }
]), async (req, res) => {
    try {
        const {
            name,
            nic,
            email,
            password,
            phone,
            addressline1,
            addressline2,
            city,
            district,
            province,
            isCandidate,
            skills,
            objectives,
            bio,
            politicalParty
        } = req.body;

        // Get file URLs
        const profilePhotoUrl = req.files['profilePhoto'] ? req.files['profilePhoto'][0].path : '';
        const nicFrontUrl = req.files['nicFront'] ? req.files['nicFront'][0].path : '';
        const nicBackUrl = req.files['nicBack'] ? req.files['nicBack'][0].path : '';
        const realtimePhotoUrl = req.files['realtimePhoto'] ? req.files['realtimePhoto'][0].path : '';

        // Validation
        const requiredFields = [
            { field: name, name: "Name" },
            { field: nic, name: "NIC" },
            { field: password, name: "Password" },
            { field: phone, name: "Phone" },
            { field: city, name: "City" },
            { field: district, name: "District" },
            { field: province, name: "Province" },
            { field: profilePhotoUrl, name: "Profile Photo" },
            { field: nicFrontUrl, name: "NIC Front" },
            { field: nicBackUrl, name: "NIC Back" },
            { field: realtimePhotoUrl, name: "Real-time Photo" }
        ];

        const missingFields = requiredFields.filter(field => !field.field);
        if (missingFields.length > 0) {
            return res.status(400).json({ success: false, message: `Please fill all required fields: ${missingFields.map(f => f.name).join(', ')}` });
        }

        // Check for existing user
        const alreadyUser = await User.findOne({ nic });
        if (alreadyUser) {
            return res.status(400).json({ success: false, message: "User already registered!" });
        }

        // Create new user
        let user = new User({
            name,
            nic,
            email,
            passwordHash: bcrypt.hashSync(password, 10),
            phone,
            addressline1,
            addressline2,
            city,
            district,
            province,
            profilePhoto: profilePhotoUrl,
            nicFront: nicFrontUrl,
            nicBack: nicBackUrl,
            realtimePhoto: realtimePhotoUrl,
            isCandidate
        });

        // Save user
        user = await user.save();
        // If user is a candidate, save candidate details
        if (user.isCandidate) {
            const newCandidate = new Candidate({
                user: user._id,
                skills: skills ? skills.split(',').map(skill => skill.trim()) : [], // Convert skills from comma-separated string
                objectives: objectives ? objectives.split(',').map(obj => obj.trim()) : [],
                bio,
                politicalParty
            });
            await newCandidate.save();
        }

        res.status(201).json({ success: true, message: "User registered successfully, awaiting NIC verification", user });

    } catch (error) {
        console.error('Internal Error: ', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// User login
router.post('/login', async(req, res) => {
    const user = await User.findOne({ nic: req.body.nic });
    const secret = process.env.SECRET_KEY;

    if (!user) {
        return res.status(400).send('The user not found');
    }

    if (!user.isVerified) {
        return res.status(403).send('User is not verified yet. Please wait for admin approval.');
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        try {
            const token = jwt.sign(
                { userId: user._id },
                secret,
                { expiresIn: '1d' }
            );
            res.status(200).json({ user: { _id: user._id, email: user.email, name: user.name, phone: user.phone, nic: user.nic, city: user.city, district: user.district, isCandidate: user.isCandidate }, token });
        } catch (error) {
            console.error('Error signing JWT token:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        return res.status(400).json({ error: 'Password is wrong' });
    }
});
module.exports = router;