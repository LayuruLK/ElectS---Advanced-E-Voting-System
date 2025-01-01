const express = require('express');
const { Election } = require('../models/election');
const router = express.Router();

// CREATE or UPDATE Results
router.post('/results/:electionId', async (req, res) => {
    try {
        const { electionId } = req.params;
        const { totalVotes, voteDistribution, winningCandidate, winningParty } = req.body;

        const election = await Election.findById(electionId);
        if (!election) return res.status(404).send('Election not found.');

        election.results = {
            totalVotes,
            voteDistribution,
            winningCandidate,
            winningParty
        };
        election.isCompleted = true;
        await election.save();

        res.status(200).send({ message: 'Results updated successfully.', results: election.results });
    } catch (error) {
        res.status(500).send({ message: 'Failed to update results.', error });
    }
});

// READ Results
router.get('/results/:electionId', async (req, res) => {
    try {
        const { electionId } = req.params;
         
        // Fetch the election and populate necessary fields
        const election = await Election.findById(electionId)
            .populate({
                path: 'results.voteDistribution.candidateId',
                populate: [
                    {
                        path: 'user',// Populate 'user' details
                        select: 'firstName profilePhoto',
                        options: { lean: true },
                    },
                    {
                        path: 'party',
                        select: 'name logo',
                        options: { lean: true },
                    }
                ]
            });

        if (!election) {
            return res.status(404).send('Election not found.');
        }
        
        // Ensure voteDistribution is always an array
        const resultsWithErrorHandling = (election.results.voteDistribution || []).map(vote => {
            if (vote.candidateId && !vote.candidateId.user) {
                return {
                    ...vote,
                    candidateId: {
                        ...vote.candidateId,
                        user: { firstName: 'Deleted User', profilePhoto: null },
                    }
                };
            }
            return vote;
        });

        res.status(200).send({ data: resultsWithErrorHandling });
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).send({ message: 'Failed to fetch results.', error });
    }
});

// DELETE Results
router.delete('/results/:electionId', async (req, res) => {
    try {
        const { electionId } = req.params;
        const election = await Election.findById(electionId);
        if (!election) return res.status(404).send('Election not found.');

        election.results = null;
        election.isCompleted = false;
        await election.save();

        res.status(200).send({ message: 'Results deleted successfully.' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to delete results.', error });
    }
});



module.exports = router;
