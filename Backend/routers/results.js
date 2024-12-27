const express = require('express');
const { Election } = require('../models/Election');
const router = express.Router();

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

module.exports = router;
