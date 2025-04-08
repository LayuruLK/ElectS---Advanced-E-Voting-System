const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ParlimentaryElection } = require('../models/ParlimentaryElection');
const { Candidate } = require('../models/candidate');
const { User } = require('../models/user');
const Service = require('../Services/GenericService');
const name = 'parlimentaryElection';

// Helper function to create a full Date object from date and time
const createFullDate = (date, time) => {
    const [hours, minutes] = time.split(':');
    const fullDate = new Date(date);
    fullDate.setHours(hours, minutes, 0, 0); // Set the time (hours, minutes)
    return fullDate;
};

// Get All Presidential Elections
router.get('/', async (req, res) => {
    try {
        const elections = await ParlimentaryElection.find();
        res.status(200).json({ success: true, data: elections });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

// Get Presidential Election By ID
router.get('/:id', async (req, res) => {
    try {
        const election = await ParlimentaryElection.findById(req.params.id);
        if (!election) {
            return res.status(404).json({ success: false, message: "Election not found" });
        }
        res.status(200).json({ success: true, data: election });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

// Get Election By id (with candidates details)
router.get('/election/:id', async (req, res) => {
    try {
        const election = await ParlimentaryElection.findById(req.params.id).populate({
            path: 'candidates',
            populate: {
                path: 'user',
                model: 'User'
            }
        });

        if (!election) {
            return res.status(404).json({ success: false, message: "Election not found" });
        }

        res.status(200).json({ success: true, data: election });
    } catch (error) {
        res.status(500).send(error + " Server Error");
    }
});

// Add New Parlimentary Election
router.post('/', async (req, res) => {
    const { year, date, startTime, endTime, description, rules } = req.body;

    if (!year || !date || !startTime || !endTime || !description) {
        return res.status(400).json({ success: false, message: "Please fill all required fields!" });
    }

    try {
        // Create full date and time for start and end time
        const electionDate = new Date(date);
        const electionStartTime = createFullDate(electionDate, startTime); // Use the helper function to create a full date-time object
        const electionEndTime = createFullDate(electionDate, endTime);

        // Create new election instance
        let newElection = new ParlimentaryElection({
            year,
            date: electionDate,
            startTime: electionStartTime,
            endTime: electionEndTime,
            description,
            rules
        });

        newElection = await newElection.save();

        if (!newElection) {
            return res.status(400).json({ success: false, message: "Election could not be added!" });
        }

        res.status(201).json({ success: true, message: "Successfully added", data: newElection });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

// Update a Parlimentary Election by ID
router.put('/:id', async (req, res) => {
    const electionId = req.params.id;
    const { year, date, startTime, endTime, description, rules } = req.body;

    try {
        const election = await ParlimentaryElection.findByIdAndUpdate(
            electionId,
            {
                year,
                date,
                startTime,
                endTime,
                description,
                rules
            },
            { new: true } // Return the updated document
        );

        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }

        res.status(200).json({
            message: 'Election updated successfully',
            election,
        });
    } catch (error) {
        console.error('Error updating election:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Apply for Parlimentary Election (add candidate)
router.post('/:id/apply', async (req, res) => {
    try {
        const userId = req.body.userId;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Ensure the user is a candidate
        if (!user.isCandidate) {
            return res.status(403).json({ success: false, message: 'You cannot apply because you are not a candidate' });
        }

        // Check if the election exists
        const election = await ParlimentaryElection.findById(req.params.id);
        if (!election) {
            return res.status(404).json({ success: false, message: 'Election not found' });
        }

        // Validate if the election has already ended
        const currentDateTime = new Date();
        const electionEndTime = new Date(election.endTime); // Ensure endTime is stored correctly in DB

        if (currentDateTime > electionEndTime) {
            return res.status(400).json({ success: false, message: "Election has ended. You can't apply." });
        }

        // Validate the 7-day application deadline
        const electionDate = new Date(election.date); // Convert election date to a Date object
        const minApplyDate = new Date(electionDate);
        minApplyDate.setDate(minApplyDate.getDate() - 7); // 7 days before election start date
        const currentDate = new Date(); // Current date

        if (currentDate > minApplyDate) {
            return res.status(400).json({ success: false, message: 'Applications must be submitted at least 7 days before the election start date.' });
        }

        // Check if candidate exists
        const candidate = await Candidate.findOne({ user: userId });
        if (!candidate) {
            return res.status(404).json({ success: false, message: 'Candidate details not found' });
        }

        // Add candidate to election if not already included
        if (!election.candidates.includes(candidate._id)) {
            election.candidates.push(candidate._id);
            await election.save();
        }

        res.status(200).json({ success: true, message: 'Applied successfully', candidate });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Endpoint to vote for candidate in Parlimentary Election
router.post('/:id/vote/:candidateId', async (req, res) => {
    const { voterId } = req.body;
    const { candidateId } = req.params;
    const { id: electionId } = req.params;

    // Validate IDs
    if (!mongoose.isValidObjectId(electionId) || !mongoose.isValidObjectId(candidateId) || !mongoose.isValidObjectId(voterId)) {
        return res.status(400).send('Invalid IDs');
    }

    try {
        const election = await ParlimentaryElection.findById(electionId).populate('candidates');
        if (!election) {
            return res.status(404).send('Election not found');
        }

        const voter = await User.findById(voterId);
        if(!voter) {
            return res.status(404).send('Voter not found');
        }

        const candidateExists = election.candidates.some(candidate =>
            candidate._id.toString() === candidateId
        );
        if (!candidateExists) {
            return res.status(404).send('Candidate not found in this election');
        }

        const hasVoted = election.results.voteDistribution.some(vote =>
            vote.voters.some(voter => voter.toString() === voterId)
        );
        if (hasVoted) {
            return res.status(400).send('You have already voted');
        }

        const candidateVote = election.results.voteDistribution.find(vote =>
            vote.candidateId.toString() === candidateId
        );
        if (candidateVote) {
            candidateVote.votes += 1;
            candidateVote.voters.push(voterId);
        } else {
            election.results.voteDistribution.push({
                candidateId,
                votes: 1,
                voters: [voterId]
            });
        }

        election.results.totalVotes += 1;

        await election.save();

        res.status(200).send('Vote successfully recorded');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Delete an Election
router.delete('/:id', (req, res) => {
    Service.deleteById(req, res, ParlimentaryElection, name).catch((error) => {
        res.status(500).send(error + " Server Error");
    });
});

module.exports = router;