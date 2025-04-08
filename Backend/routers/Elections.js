const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Election } = require('../models/election');
const { User } = require('../models/user');
const Service = require('../Services/GenericService');
const { Candidate } = require('../models/candidate');
const name = 'Election';

// Helper function to create a full Date object from date and time
const createFullDate = (date, time) => {
    const [hours, minutes] = time.split(':');
    const fullDate = new Date(date); // Start with the provided date
    fullDate.setHours(hours, minutes, 0, 0); // Set the time part to the provided hours and minutes
    return fullDate;
};


// Get Elections
router.get('/', async (req, res) => {
    Service.getAll(res, Election, name).catch((error) => {
        res.status(500).send(error + " Server Error");
    });
});

// Get Election By id
router.get('/:id', async (req, res) => {
    Service.getById(req, res, Election, name).catch((error) => {
        res.status(500).send(error + " Server Error");
    });
});

// Delete an Election
router.delete('/:id', (req, res) => {
    Service.deleteById(req, res, Election, name).catch((error) => {
        res.status(500).send(error + " Server Error");
    });
});

// Get Count
router.get('/get/count', (req, res) => {
    Service.getCount(res, Election, name).catch((error) => {
        res.status(500).send(error + " Server Error");
    });
});


// Add new Election
router.post('/', async (req, res) => {
    const { name, where, date, startTime, endTime, description, rules } = req.body;
  
    // Validate required fields
    if (!name || !where || !date || !startTime || !endTime || !description) {
      return res.status(400).json({ success: false, message: "Please fill all the required fields!" });
    }
  
    try {
      // Parse the date and time fields
      const electionDate = new Date(date);  // Date when the election happens
      const electionStartTime = new Date(startTime);  // Start time of the election
      const electionEndTime = new Date(endTime);  // End time of the election
  
      // Set the year, month, and date of start and end times according to the election date
      electionStartTime.setFullYear(electionDate.getFullYear(), electionDate.getMonth(), electionDate.getDate());
      electionEndTime.setFullYear(electionDate.getFullYear(), electionDate.getMonth(), electionDate.getDate());
  
      // Create a new election object
      let election = new Election({
        name,
        where,
        date: electionDate,
        startTime: electionStartTime,
        endTime: electionEndTime,
        description,
        rules
      });
  
      // Save the election to the database
      election = await election.save();
  
      if (!election) {
        return res.status(400).json({ success: false, message: "Election could not be added!" });
      }
  
      // Return success response
      res.status(201).json({ success: true, message: "Successfully added", data: election });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  });


  // Update an Election by ID
router.put('/:id', async (req, res) => {
    const electionId = req.params.id;
    const { name, where, date, description, rules, startTime, endTime } = req.body;
  
    try {
      // Find the election by ID and update it
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
  
    
  

// Get Election By id (with candidates details)
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

// Apply for Election
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
        const election = await Election.findById(req.params.id);
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

router.get("/results", (req, res) => {
    const results = {
      Colombo: { votes: 150000, winningParty: "Party A" },
      Kandy: { votes: 120000, winningParty: "Party B" },
      Jaffna: { votes: 80000, winningParty: "Party A" },
    };
    res.json(results);
  });


// Endpoint to vote for candidate
router.post('/:candidateId/vote', async (req, res) => {
    const { electionId } = req.body;
    const { voterId } = req.body;
    const { candidateId } = req.params;

    // Validate IDs
    if (!mongoose.isValidObjectId(electionId) || !mongoose.isValidObjectId(candidateId) || !mongoose.isValidObjectId(voterId)) {
        return res.status(400).send('Invalid Election ID, Voter ID or Candidate ID');
    }

    try {
        // Fetch the election
        const election = await Election.findById(electionId).populate('candidates');
        if (!election) {
            return res.status(404).send('Election not found');
        }

        const voter = await User.findById(voterId);
        if(!voter) {
            return res.status(404).send('Voter not found')
        }

        // Check if the election is ongoing
        /* const currentDateTime = new Date();
        const electionStartTime = new Date(`${election.date}T${election.startTime}`);
        const electionEndTime = new Date(`${election.date}T${election.endTime}`);
        if (currentDateTime < electionStartTime || currentDateTime > electionEndTime) {
            return res.status(400).send('Election is not active');
        } */

        // Ensure the candidate belongs to this election
        const candidateExists = election.candidates.some(candidate => 
            candidate._id.toString() === candidateId);
        if (!candidateExists) {
            return res.status(404).send('Candidate not found in this election');
        }

        // Check if the voter has already voted in this election
        const hasVoted = election.results.voteDistribution.some(vote =>
            vote.voters.some(voter => voter.toString() === voterId)
        );
        if (hasVoted) {
            return res.status(400).send('You have already voted in this election');
        }

        // Update the vote distribution
        const candidateVote = election.results.voteDistribution.find(vote => 
            vote.candidateId.toString() === candidateId);
        if (candidateVote) {
            candidateVote.voters.push(voterId);
            candidateVote.votes += 1;
        } else {
            election.results.voteDistribution.push({ 
                candidateId, 
                votes: 1,
                voters: [voterId]
            });
        }

        // Increment total votes
        election.results.totalVotes += 1;

        // Save election data
        await election.save();

        res.status(200).send('Vote successfully recorded');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
