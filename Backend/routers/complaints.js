const express = require('express');
const router = express.Router();
const { Complaint } = require('../models/complaint');
const { User } = require('../models/user');
const { Candidate } = require('../models/candidate');
const uploadFile = require('../helpers/upload');

// Get all complaints
router.get('/', async (req, res) => {
    try {
        const complaints = await Complaint.find().populate('user', 'name email').populate('candidate', 'user').exec();
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


//Get Complaints by a user ID
router.get('/comp/:id', async(req,res) =>{
    const userId = req.params.id;
    
    try{

        const candidate = await Candidate.findOne({user:userId})    
        const candidateId = candidate._id;
      
        const complaints = await Complaint.find({candidate:candidateId})
            
        if (!complaints) {
            return res.status(404).json({success:false, message:'Complaints Not Found'});
        }

        res.status(200).json({success:true, data: complaints});
    } catch(error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

// Get complaint by ID
router.get('/:id', async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id).populate('user', 'name email').populate('candidate', 'user').exec();
        if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
        res.status(200).json(complaint);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
