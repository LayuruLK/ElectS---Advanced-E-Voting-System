const express = require('express');
const { Election } = require('../models/election');
const { populate } = require('dotenv');
const { PresidentialElection } = require('../models/presidentialElection');
const { ParlimentaryElection } = require('../models/ParlimentaryElection');
const { ProvincialElection } = require('../models/ProvincialElection');
const { User } = require('../models/user');
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
// General Election
router.get('/general/:electionId', async (req, res) => {
    try {
        const { electionId } = req.params;

        // Fetch the election and populate necessary fields within the results attribute
        const election = await Election.findById(electionId)
            .populate({
                path: 'results.winningCandidate.candidateId',
                populate: {
                    path: 'user', // Populate user details
                    select: 'firstName lastName profilePhoto',
                    options: { lean: true },
                },
            })
            .populate({
                path: 'results.winningParty.partyId',
                select: 'name logo',
                options: { lean: true },
            })
            .populate({
                path: 'results.voteDistribution.candidateId',
                populate: [
                    {
                        path: 'user', // Populate 'user' details
                        select: 'firstName lastName profilePhoto',
                        options: { lean: true },
                    },
                    {
                        path: 'party', // Populate 'party' details
                        select: 'name logo',
                        options: { lean: true },
                    },
                ],
            });

        if (!election) {
            return res.status(404).send('Election not found.');
        }

        // Ensure voteDistribution is always an array and handle missing candidate user
        const resultsWithErrorHandling = await Promise.all(
            (election.results.voteDistribution || []).map(async (vote) => {
                // Handle missing candidate user
                const candidate = vote.candidateId;
                if (candidate && !candidate.user) {
                    vote.candidateId.user = { firstName: 'Deleted User', profilePhoto: null };
                }

                // Populate voters details
                const votersDetails = await User.find({
                    _id: { $in: vote.voters },
                }).select('firstName lastName profilePhoto district province');

                return {
                    ...vote.toObject(),
                    voters: votersDetails,
                };
            })
        );

        res.status(200).send({
            data: {
                ...election.toObject(),
                results: {
                    ...election.results,
                    voteDistribution: resultsWithErrorHandling,
                },
            },
        });
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).send({ message: 'Failed to fetch results.', error });
    }
});



//Presidential Election
router.get('/presidential/:electionId', async (req, res) => {
    try {
        const { electionId } = req.params;

        // Fetch the election and populate necessary fields within the results attribute
        const election = await PresidentialElection.findById(electionId)
            .populate({
                path: 'results.winningCandidate.candidateId',
                populate: {
                    path: 'user', // Populate user details
                    select: 'firstName lastName profilePhoto',
                    options: { lean: true },
                },
            })
            .populate({
                path: 'results.winningParty.partyId',
                select: 'name logo',
                options: { lean: true },
            })
            .populate({
                path: 'results.voteDistribution.candidateId',
                populate: [
                    {
                        path: 'user', // Populate 'user' details
                        select: 'firstName lastName profilePhoto',
                        options: { lean: true },
                    },
                    {
                        path: 'party', // Populate 'party' details
                        select: 'name logo',
                        options: { lean: true },
                    },
                ],
            });

        if (!election) {
            return res.status(404).send('Election not found.');
        }

        // Ensure voteDistribution is always an array and handle missing candidate user
        const resultsWithErrorHandling = await Promise.all(
            (election.results.voteDistribution || []).map(async (vote) => {
                // Handle missing candidate user
                const candidate = vote.candidateId;
                if (candidate && !candidate.user) {
                    vote.candidateId.user = { firstName: 'Deleted User', profilePhoto: null };
                }

                // Populate voters details
                const votersDetails = await User.find({
                    _id: { $in: vote.voters },
                }).select('firstName lastName profilePhoto district province');

                return {
                    ...vote.toObject(),
                    voters: votersDetails,
                };
            })
        );

        res.status(200).send({
            data: {
                ...election.toObject(),
                results: {
                    ...election.results,
                    voteDistribution: resultsWithErrorHandling,
                },
            },
        });
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).send({ message: 'Failed to fetch results.', error });
    }
});

//Parlimentary Election
router.get('/parlimentary/:electionId', async (req, res) => {
    try {
        const { electionId } = req.params;

        // Fetch the election and populate necessary fields within the results attribute
        const election = await ParlimentaryElection.findById(electionId)
            .populate({
                path: 'results.winningCandidate.candidateId',
                populate: {
                    path: 'user', // Populate user details
                    select: 'firstName lastName profilePhoto',
                    options: { lean: true },
                },
            })
            .populate({
                path: 'results.winningParty.partyId',
                select: 'name logo',
                options: { lean: true },
            })
            .populate({
                path: 'results.voteDistribution.candidateId',
                populate: [
                    {
                        path: 'user', // Populate 'user' details
                        select: 'firstName lastName profilePhoto',
                        options: { lean: true },
                    },
                    {
                        path: 'party', // Populate 'party' details
                        select: 'name logo',
                        options: { lean: true },
                    },
                ],
            });

        if (!election) {
            return res.status(404).send('Election not found.');
        }

        // Ensure voteDistribution is always an array and handle missing candidate user
        const resultsWithErrorHandling = await Promise.all(
            (election.results.voteDistribution || []).map(async (vote) => {
                // Handle missing candidate user
                const candidate = vote.candidateId;
                if (candidate && !candidate.user) {
                    vote.candidateId.user = { firstName: 'Deleted User', profilePhoto: null };
                }

                // Populate voters details
                const votersDetails = await User.find({
                    _id: { $in: vote.voters },
                }).select('firstName lastName profilePhoto district province');

                return {
                    ...vote.toObject(),
                    voters: votersDetails,
                };
            })
        );

        res.status(200).send({
            data: {
                ...election.toObject(),
                results: {
                    ...election.results,
                    voteDistribution: resultsWithErrorHandling,
                },
            },
        });
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).send({ message: 'Failed to fetch results.', error });
    }
});


//Provincial Election
router.get('/provincial/:electionId', async (req, res) => {
    try {
        const { electionId } = req.params;

        // Fetch the election and populate necessary fields within the results attribute
        const election = await ProvincialElection.findById(electionId)
            .populate({
                path: 'results.winningCandidate.candidateId',
                populate: {
                    path: 'user', // Populate user details
                    select: 'firstName lastName profilePhoto',
                    options: { lean: true },
                },
            })
            .populate({
                path: 'results.winningParty.partyId',
                select: 'name logo',
                options: { lean: true },
            })
            .populate({
                path: 'results.voteDistribution.candidateId',
                populate: [
                    {
                        path: 'user', // Populate 'user' details
                        select: 'firstName lastName profilePhoto',
                        options: { lean: true },
                    },
                    {
                        path: 'party', // Populate 'party' details
                        select: 'name logo',
                        options: { lean: true },
                    },
                ],
            });

        if (!election) {
            return res.status(404).send('Election not found.');
        }

        // Ensure voteDistribution is always an array and handle missing candidate user
        const resultsWithErrorHandling = await Promise.all(
            (election.results.voteDistribution || []).map(async (vote) => {
                // Handle missing candidate user
                const candidate = vote.candidateId;
                if (candidate && !candidate.user) {
                    vote.candidateId.user = { firstName: 'Deleted User', profilePhoto: null };
                }

                // Populate voters details
                const votersDetails = await User.find({
                    _id: { $in: vote.voters },
                }).select('firstName lastName profilePhoto district province');

                return {
                    ...vote.toObject(),
                    voters: votersDetails,
                };
            })
        );

        res.status(200).send({
            data: {
                ...election.toObject(),
                results: {
                    ...election.results,
                    voteDistribution: resultsWithErrorHandling,
                },
            },
        });
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
