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


module.exports = router;