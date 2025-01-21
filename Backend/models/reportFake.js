const mongoose = require('mongoose');

const reportFakeSchema = new mongoose.Schema({
    complaintId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint',
        required: true,
    },
    explanation: {
        type: String,
        required: true,
    },
    proofs: [
        {
            type: String, // File paths to the uploaded proofs
        },
    ],
    reportedAt: {
        type: Date,
        default: Date.now,
    },
    isReviewed: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model('ReportFake', reportFakeSchema);