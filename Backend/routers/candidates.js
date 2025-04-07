const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { User } = require('../models/user');
const { Candidate } = require('../models/candidate');
const { PoliticalParty } = require('../models/party');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const multer = require('multer');
const cloudinaryStorage = require('../helpers/cloudinaryStorage');
const upload = multer({ storage: cloudinaryStorage });

const Service = require('../Services/GenericService')
const name = 'Candidate'



// Endpoint to get all candidates
router.get('/candidates', async (req, res) => {
    try {
        const candidates = await Candidate.find().populate('user', 'name');
        res.status(200).json(candidates);
    } catch (error) {

        res.status(500).json({ error: 'Failed to fetch candidates' });
    }
});

//Get candidates
router.get('/', async (req, res) => {
    const result = await Candidate.find().populate('user')
    if (result) {
        res.status(200).json({ success: true, data: result, message: `All ${name} fetched successfully` })
    } else {
        res.status(404).send(name + "not found!")
    }
})

//Get Candidate By id
router.get('/profile/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Check if the ID is a valid MongoDB ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'Invalid candidate ID format.' });
        }

        // Fetch candidate by ID and populate user details
        const candidate = await Candidate.findById(id).populate('user').populate('party');

        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found.' });
        }

        // Respond with the candidate data
        res.status(200).json({ data: candidate });
    } catch (error) {
        console.error('Error fetching candidate:', error.message);

        // Handle unexpected server errors
        res.status(500).json({ error: 'An internal server error occurred. Please try again later.' });
    }
});

//Get Candidate By User id
router.get('/user/profile/:id', async (req, res) => {
    const id = req.params.id;

    const candidate = await Candidate.findOne({ user: id });

    const result = await Candidate.findById(candidate._id).populate('user')
    if (result) {
        res.status(200).json({ data: result })
    } else {
        res.status(404).send(name + "not found!")
    }
})

// Get Candidates by political party and same district as user
router.get('/party/:partyid/:userid', async (req, res) => {
    try {
        const { partyid, userid } = req.params;

        // Fetch the user to get their district
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if the political party exists
        const party = await PoliticalParty.findById(partyid);
        if (!party) {
            return res.status(404).json({ success: false, message: 'Political Party not found' });
        }

        // Fetch candidates who belong to the specified party and are from the same district as the user
        const candidates = await Candidate.find({ party: partyid })
            .populate({
                path: 'user',
                match: { district: user.district }, // Filter candidates based on district
                select: 'firstName lastName profilePhoto district' // Select required user fields
            });

        // Remove candidates where the user field is null (due to mismatch in district)
        const filteredCandidates = candidates.filter(candidate => candidate.user !== null);

        return res.status(200).json({ success: true, candidates: filteredCandidates });

    } catch (error) {
        console.error('Error fetching candidates:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

//Delete an Candidate
router.delete('/:id', (req, res) => {
    Service.deleteById(req, res, Candidate, name).catch((error) => {
        res.status(500).send(error + " Server Error")
    })
})


//getCount
router.get('/get/count', (req, res) => {
    Service.getCount(res, Candidate, name).catch((error) => {
        res.status(500).send(error + " Server Error")
    })
})

// Get the count of projects done by a particular user
router.get('/user/count/:userId', async (req, res) => {
    const userId = req.params.userId;

    // Validate userId format
    if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid User ID format' });
    }

    try {
        // Count projects associated with the user
        const projectCount = await Project.countDocuments({ user: userId });

        res.status(200).json({
            success: true,
            count: projectCount,
            message: `Total projects count for user ${userId} fetched successfully`
        });

    } catch (error) {
        console.error('Error fetching project count:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Update candidate details
router.put('/:id', upload.single('profilePhoto'), async (req, res) => {
    try {
        const person = await Candidate.findOne({ user: req.params.id });

        const userExist = await User.findById(person._id);
        let newPassword;

        if (req.body.password) {
            newPassword = bcrypt.hashSync(req.body.password, 10);
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
            { new: true }
        );

        if (!user) {
            return res.status(400).send('The user cannot be updated!');
        }

        const candidate = await Candidate.findByIdAndUpdate(
            person._id,
            {
                skills: req.body.skills,
                objectives: req.body.objectives,
                bio: req.body.bio,
                party: req.body.party
            },
            { new: true }
        );

        res.send({
            user,
            candidate
        });
    } catch (error) {
        res.status(500).send('An error occurred: ' + error.message);
    }
});


// Endpoint to vote for candidate
router.post('/:id/vote', async (req, res) => {
    const { userId, electionId } = req.body;

    if (!mongoose.isValidObjectId(req.params.id) || !mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(electionId)) {
        return res.status(400).send('Invalid Candidate Id, User Id, or Election Id');
    }

    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
        return res.status(404).send('Candidate not found');
    }

    // Check if the user has already voted in this election
    const alreadyVoted = await Candidate.findOne({
        votes: { $elemMatch: { voter: userId, election: electionId } }
    });

    if (alreadyVoted) {
        return res.status(400).send('You have already voted in this election');
    }

    // Add user vote
    candidate.votes.push({ voter: userId, election: electionId });
    await candidate.save();

    res.status(200).send(candidate);
});

//Get pending verifications
router.get('/pending-verifications', async (req, res) => {
    try {
        const pendingUsers = await Candidate.find({ isVerified: false }).populate('user').populate('party', 'name');

        /* if (!pendingUsers.length) {
            return res.status(404).json({ success: false, message: 'No pending verifications found' });
        } */

        res.status(200).json({ success: true, users: pendingUsers });
    } catch (error) {
        console.error('Error fetching pending verifications:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

//API Route to Verify or Reject Users
router.put('/verify/:userId', async (req, res) => {
    const { isVerified } = req.body;

    try {
        const candidate = await Candidate.findById(req.params.userId);

        if (!candidate) {
            return res.status(404).json({ success: false, message: 'Candidate not found' });
        }

        candidate.isVerified = isVerified;
        await candidate.save();

        res.status(200).json({ success: true, message: `Candidate ${isVerified ? 'approved' : 'rejected'} successfully` });
    } catch (error) {
        console.error('Error updating verification status:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


// Route to get the count of pending verifications for candidates
router.get('/get/pendingcandidates/count', async (req, res) => {
    try {
        const pendingUsersCount = await Candidate.countDocuments({ isVerified: false });
        res.status(200).json({ success: true, count: pendingUsersCount });
    } catch (error) {
        console.error('Error fetching pending verifications count:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;