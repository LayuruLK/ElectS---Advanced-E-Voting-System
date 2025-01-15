const mongoose = require('mongoose');

const ParlimentaryElectionSchema = mongoose.Schema({
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







});

const ParlimentaryElection = mongoose.model('ParliamentaryElection', ParlimentaryElectionSchema);

module.exports = { ParlimentaryElection };