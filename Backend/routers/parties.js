const express = require('express');
const router = express.Router();
const { PoliticalParty } = require('../models/party');
const { Candidate } = require('../models/candidate');

const multer = require('multer');
const cloudinaryStorage = require('../helpers/cloudinaryStorage');
const upload = multer({ storage: cloudinaryStorage });

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

// Create a new party
router.post('/', upload.single('logo'), async (req, res) => {
    try {
        const {
            name,
            abbreviation,
            leader, // Optional
            foundingDate,
            headquarters,
            contactDetails,
            website
        } = req.body;

        // Check for missing fields except `leader`
        if (!name || !abbreviation || !foundingDate || !headquarters || !contactDetails) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields except leader' });
        }

        const logoUrl = req.file ? req.file.path : '';

        const newParty = new PoliticalParty({
            name,
            abbreviation,
            logo: logoUrl,
            foundingDate,
            headquarters: JSON.parse(headquarters), // Parse headquarters JSON string
            contactDetails: JSON.parse(contactDetails), // Parse contactDetails JSON string
            website
        });

        // Only add `leader` if it's provided
        if (leader) {
            newParty.leader = leader;
        }

        await newParty.save();
        res.status(201).json({ success: true, message: 'Political Party created successfully', party: newParty });
    } catch (error) {
        console.error('Error creating party:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Update a party
router.put('/:id', upload.single('logo'), async (req, res) => {
    try {
        const { name, abbreviation, leader, foundingDate, headquarters, contactDetails, website } = req.body;

        const updatedFields = {
            name,
            abbreviation,
            leader,
            foundingDate,
            headquarters: headquarters ? JSON.parse(headquarters) : undefined,
            contactDetails: contactDetails ? JSON.parse(contactDetails) : undefined,
            website,
        };

        if (req.file) {
            updatedFields.logo = req.file.path;
        }

        const updatedParty = await PoliticalParty.findByIdAndUpdate(
            req.params.id,
            { $set: updatedFields },
            { new: true }
        );

        if (!updatedParty) {
            return res.status(404).json({ success: false, message: 'Party not found' });
        }

        res.status(200).json({ success: true, message: 'Political Party updated successfully', party: updatedParty });
    } catch (error) {
        console.error('Error updating party:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Delete a party
router.delete('/:id', async (req, res) => {
    try {
        const deletedParty = await PoliticalParty.findByIdAndDelete(req.params.id);

        if (!deletedParty) {
            return res.status(404).json({ success: false, message: 'Party not found' });
        }

        res.status(200).json({ success: true, message: 'Political Party deleted successfully' });
    } catch (error) {
        console.error('Error deleting party:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
