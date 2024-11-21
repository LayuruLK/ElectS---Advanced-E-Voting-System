const mongoose = require('mongoose');
const User = require('../models/user')

const candidateSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
    votes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

exports.Candidate = mongoose.model('Candidate', candidateSchema);
exports.candidateSchema = candidateSchema;