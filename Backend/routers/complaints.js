const express = require('express');
const router = express.Router();
const { Complaint } = require('../models/complaint');
const { User } = require('../models/user');
const { Candidate } = require('../models/candidate');

const multer = require('multer');
const cloudinaryStorage = require('../helpers/cloudinaryStorage');
const uploadFile = multer({ storage: cloudinaryStorage });

// Get all complaints
router.get('/', async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate('user', 'firstName lastName email') // Populate user details for the complainant
            .populate({
                path: 'candidate', 
                select: 'user', 
                populate: { path: 'user', select: 'firstName lastName' }  // Explicitly populate candidate's user details
            })
            .exec();
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

//Get complaints by owner ID
router.get('/comp/owner/:id', async(req,res) => {
    const ownerID = req.params.id;

    try {
        const owner = await User.findOne({_id:ownerID})

        if(owner) {
            const complaints = await Complaint.find({user:ownerID})
            .populate('user', 'firstName lastName email') // Populate user details for the complainant
            .populate({
                path: 'candidate', 
                select: 'user', 
                populate: { path: 'user', select: 'firstName lastName' }  // Explicitly populate candidate's user details
            })
            .exec();

            if (complaints) {
                res.status(200).json({success:true, data: complaints});
            } else{
                return res.status(404).json({success:false, message: 'Complaints not found'})
            }
        } else {
            return res.status(404).json({success:false, message: 'User not found'})
        }
    } catch(error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

//Get Oly Reviewed Complaints by a user ID
router.get('/comp/reviewed/:id', async(req,res) =>{
    const userId = req.params.id;
    
    try{

        const candidate = await Candidate.findOne({user:userId})    
        const candidateId = candidate._id;
      
        const complaints = await Complaint.find({candidate:candidateId, isReviewed:true})
            
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

// Create a new complaint
router.post('/', uploadFile.array('proofs', 5), async (req, res) => {
    try {
        const { user, candidate, title, description } = req.body;
        const proofFiles = req.files.map(file => file.path);

        const existingUser = await User.findById(user);
        const existingCandidate = await Candidate.findById(candidate);

        if (!existingUser || !existingCandidate) {
            return res.status(400).json({ success: false, message: 'Invalid user or candidate' });
        }

        const complaint = new Complaint({
            user,
            candidate,
            title,
            description,
            proofs: proofFiles
        });

        const savedComplaint = await complaint.save();

        res.status(201).json({ success: true, message: 'Complaint submitted successfully', complaint: savedComplaint });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Delete a complaint
router.delete('/:id', async (req, res) => {
    try {
        const deletedComplaint = await Complaint.findByIdAndDelete(req.params.id);
        if (!deletedComplaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
        res.status(200).json({ success: true, message: 'Complaint deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Get complaints pending review
router.get('/show/pending-reviews', async (req, res) => {
    try {
        const pendingComplaints = await Complaint.find({ isReviewed: false })
            .populate('user', 'firstName lastName email') // Ensure `name` and `email` exist in the `User` schema
            .populate({
                path: 'candidate',
                populate: { path: 'user', select: 'firstName lastName email' }, // Adjust the structure if `Candidate` has nested `user`
            })
            .exec();

        res.status(200).json({ success: true, data: pendingComplaints });
    } catch (error) {
        console.error('Error fetching pending complaints:', error); // Log error for debugging
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

// Update complaint review status
router.put('/review/:id', async (req, res) => {
    const { isReviewed, reviewComments } = req.body;

    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

        complaint.isReviewed = isReviewed;
        complaint.reviewComments = reviewComments;

        const updatedComplaint = await complaint.save();
        res.status(200).json({ success: true, message: 'Complaint reviewed successfully', data: updatedComplaint });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

router.get('/get/pendingverifications/count', async (req, res) => {
    try {
      const pendingUsersCount = await Complaint.countDocuments({ isReviewed: false });
      res.status(200).json({ success: true, count: pendingUsersCount });
    } catch (error) {
      console.error('Error fetching pending verifications count:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });


module.exports = router;