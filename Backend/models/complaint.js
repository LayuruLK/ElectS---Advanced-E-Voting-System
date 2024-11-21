const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    proofs: [{
        type: String // Store the file paths
    }],
    isReviewed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

exports.Complaint = mongoose.model('Complaint', complaintSchema);
