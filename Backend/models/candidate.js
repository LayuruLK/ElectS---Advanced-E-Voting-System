const mongoose = require('mongoose');
const User = require('../models/user')

const candidateSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    party: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PoliticalParty', // Reference to PoliticalParty
        required: true // Optional if independent candidates are allowed
    },
    skills: {
        type: [String],
        required: true
    },
    objectives: {
        type: [String],
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    /* votes: [{
        voter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        election: { type: mongoose.Schema.Types.ObjectId, ref: 'Election' }
    }], */
    isVerified: {  
        type: Boolean,
        default: false
    },
})

exports.Candidate = mongoose.model('Candidate', candidateSchema);
exports.candidateSchema = candidateSchema;