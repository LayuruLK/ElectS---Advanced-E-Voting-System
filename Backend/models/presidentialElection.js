const mongoose = require('mongoose');

const presidentialElectionSchema = mongoose.Schema({
    year: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rules: {
        type: String
    },
    candidates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate'
    }],
    results: {
        totalVotes: { type: Number, default: 0 }, // Total votes cast
        winningCandidate: {
            candidateId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Candidate'
            },
            name: { type: String } // Candidate's name for quick access
        },
        winningParty: {
            partyId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'PoliticalParty'
            },
            name: { type: String } // Party name for quick access
        },
        voteDistribution: [{
            candidateId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Candidate'
            },
            votes: { type: Number, default: 0 }, // Votes received by the candidate
            voters: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }]
        }]
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
});

const PresidentialElection = mongoose.model('PresidentialElection', presidentialElectionSchema);

module.exports = { PresidentialElection };
