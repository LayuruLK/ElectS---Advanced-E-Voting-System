const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const {Candidate} = require('../models/candidate');
const Service = require('../Services/GenericService');
const upload = require('../helpers/upload');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const name = 'User';
const mongoose = require('mongoose');
const {PoliticalParty} = require('../models/party');

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
            firstName,
            lastName,
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
            party
        } = req.body;

        // Get file URLs
        const profilePhotoUrl = req.files['profilePhoto'] ? req.files['profilePhoto'][0].path : '';
        const nicFrontUrl = req.files['nicFront'] ? req.files['nicFront'][0].path : '';
        const nicBackUrl = req.files['nicBack'] ? req.files['nicBack'][0].path : '';
        const realtimePhotoUrl = req.files['realtimePhoto'] ? req.files['realtimePhoto'][0].path : '';

        // Validation
        const requiredFields = [
            { field: firstName, name: "First Name" },
            { field: lastName, name: "Last Name" },
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
            firstName,
            lastName,
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

        //If user is a candidate, save candidate deatils
        if(user.isCandidate){
            const {politicalParty} = req.body;

            const politicalPartyExists = await PoliticalParty.findById(politicalParty);
            if (!politicalPartyExists) {
                return res.status(400).json({success:false, message: "Invalid Political Party ID" });
            }

            const newCandidate = new Candidate({
                user: user._id,
                skills: skills ? skills.split(',').map(skill => skill.trim()) : [], //Convert skills from comma-separated string
                objectives: objectives ? objectives.split(',').map(obj => obj.trim()) : [],
                bio,
                party: politicalParty,
            });
            await newCandidate.save();
        }

        // Save user
        user = await user.save();

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
            res.status(200).json({ user: { _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, phone: user.phone, nic: user.nic, city: user.city, district: user.district, isCandidate: user.isCandidate }, token });
        } catch (error) {
            console.error('Error signing JWT token:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        return res.status(400).json({ error: 'Password is wrong' });
    }
});

//Update user details
router.put('/:id', upload.single('profilePhoto'), async (req, res)=> {

    const userExist = await User.findById(req.params.id);
    let newPassword
    if(req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash;
    }

    const profilePhotoUrl = req.file ? req.file.path : userExist.profilePhoto;

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nic: req.body.nic,
            passwordHash: newPassword,
            email: req.body.email,
            phone: req.body.phone,
            addressline1: req.body.addressline1,
            addressline2: req.body.addressline2,
            city: req.body.city,
            district: req.body.district,
            province: req.body.province,
            isCandidate: req.body.isCandidate,
            profilePhoto: profilePhotoUrl
        },
        { new: true}
    )

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})

router.post('/edit/verify-password', async (req, res) => {
    try {
        const { currentPassword, userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid current password" });
        }

        res.json({ success: true, message: "Password verified" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

//Get Pending Verification
router.get('/pending-verifications', async (req,res)=> {
    try {
        const pendingUsers = await User.find({ isVerified: false }).select('firstName lastName nic nicFront nicBack profilePhoto');
        res.status(200).json({ success:true, users: pendingUsers});
    } catch (error) {
        console.error('Error fetching pending verifications:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error'});
    }
});

//API Route to Verify or Reject Users
router.put('/verify/:userId', async (req,res) => {
    const { isVerified } = req.body;

    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User Not Found'});
        }

        user.isVerified = isVerified;
        await user.save();

        res.status(200).json({ success: true, message:`User ${isVerified ? 'approved' : 'rejected'} successfully` });
    } catch (error) {
        console.error('Error updating verification status:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error'});
    }
})

// Update user details with real-time photo
router.put('/updatephoto/:id', upload.single('realtimePhoto'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if a new real-time photo is uploaded
        const realtimePhotoUrl = req.file ? req.file.path : null;

        if (!realtimePhotoUrl) {
            return res.status(400).json({ success: false, message: 'Real-time photo is required' });
        }

        // Update the user's real-time photo and update timestamp
        user.realtimePhoto = realtimePhotoUrl;
        user.photoUpdatedAt = Date.now();

        await user.save();

        res.status(200).json({ success: true, message: 'Real-time photo updated successfully', user });
    } catch (error) {
        console.error('Error updating real-time photo:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;