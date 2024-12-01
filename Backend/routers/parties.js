const express = require('express');
const router = express.Router();
const { PoliticalParty } = require('../models/party');
const { Candidate } = require('../models/candidate');
const upload = require('../helpers/upload');

// Get all parties
router.get('/', async (req, res) => {
    try {
        const parties = await PoliticalParty.find();
        res.status(200).json({ success: true, parties });
    } catch (error) {
        console.error('Error fetching parties:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Get all names of parties
router.get('/party', async (req, res) => {
    try {
        const parties = await PoliticalParty.find();
        res.status(200).json({ success: true, data: parties });
    } catch (error) {
        console.error('Error fetching parties:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Get party by ID
router.get('/:id', async (req, res) => {
    try {
        const party = await PoliticalParty.findById(req.params.id).populate('leader candidates electionsParticipated.election');
        if (!party) {
            return res.status(404).json({ success: false, message: 'Party not found' });
        }
        res.status(200).json({ success: true, party });
    } catch (error) {
        console.error('Error fetching party:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;