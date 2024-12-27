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

router.get('/results/:electionId', async (req, res) => {
    try {
        const { electionId } = req.params;

        const election = await Election.findById(electionId)
            .populate({
                path: 'results.voteDistribution.candidateId',
                populate: [
                    {
                        path: 'user',
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


module.exports = router;
