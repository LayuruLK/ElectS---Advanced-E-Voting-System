const express = require('express');
const router = express.Router();
const { Election } = require('../models/election');
const { User } = require('../models/user');
const Service = require('../Services/GenericService');
const { Candidate } = require('../models/candidate');
const name = 'Election';

router.get('/', async (req, res) => {
    Service.getAll(res, Election, name).catch((error) => {
        res.status(500).send(error + " Server Error");
    });
});

router.get('/:id', async (req, res) => {
    Service.getById(req, res, Election, name).catch((error) => {
        res.status(500).send(error + " Server Error");
    });
});

router.delete('/:id', (req, res) => {
    Service.deleteById(req, res, Election, name).catch((error) => {
        res.status(500).send(error + " Server Error");
    });
});

router.get('/get/count', (req, res) => {
    Service.getCount(res, Election, name).catch((error) => {
        res.status(500).send(error + " Server Error");
    });
});

router.post('/', async (req, res) => {
    const { name, where, date, startTime, endTime, description, rules } = req.body;
  
    if (!name || !where || !date || !startTime || !endTime || !description) {
      return res.status(400).json({ success: false, message: "Please fill all the required fields!" });
    } 
    try {
      const electionDate = new Date(date);  
      const electionStartTime = new Date(startTime);  
      const electionEndTime = new Date(endTime);  
      electionStartTime.setFullYear(electionDate.getFullYear(), electionDate.getMonth(), electionDate.getDate());
      electionEndTime.setFullYear(electionDate.getFullYear(), electionDate.getMonth(), electionDate.getDate());
  
      let election = new Election({
        name,
        where,
        date: electionDate,
        startTime: electionStartTime,
        endTime: electionEndTime,
        description,
        rules
      });
  
      election = await election.save();
  
      if (!election) {
        return res.status(400).json({ success: false, message: "Election could not be added!" });
      }
  
      res.status(201).json({ success: true, message: "Successfully added", data: election });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.put('/:id', async (req, res) => {
    const electionId = req.params.id;
    const { name, where, date, description, rules, startTime, endTime } = req.body;
  
    try {
      const election = await Election.findByIdAndUpdate(
        electionId,
        {
          name,
          where,
          date,
          description,
          rules,
          startTime,
          endTime
        },
        { new: true }
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
router.get('/election/:id', async (req, res) => {
    try {
        const election = await Election.findById(req.params.id).populate({
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
router.post('/:id/apply', async (req, res) => {
    const userId = req.body.userId;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).send('User not found');
    }

    if (!user.isCandidate) {
        return res.status(403).send('You cannot apply because you are not a candidate');
    }

    const election = await Election.findById(req.params.id);
    if (!election) {
        return res.status(404).send('Election not found');
    }

    const candidate = await Candidate.findOne({ user: userId });
    if (!candidate) {
        return res.status(404).send('Candidate details not found');
    }
    
    if (!election.candidates.includes(candidate._id)) {
        election.candidates.push(candidate._id);
        await election.save();
    }

    res.status(200).json({ success: true, message: 'Applied successfully', candidate });
});
module.exports=router;