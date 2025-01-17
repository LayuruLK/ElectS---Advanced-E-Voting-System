const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ParlimentaryElection } = require('../models/ParlimentaryElection');
const { Candidate } = require('../models/candidate');
const { User } = require('../models/user');
const Service = require('../Services/GenericService');
const name = 'parlimentaryElection';


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







module.exports = router;