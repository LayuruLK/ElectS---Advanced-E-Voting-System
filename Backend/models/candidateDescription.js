const mongoose = require('mongoose');

const candidateDescriptionSchema = mongoose.Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
    },
    description: { 
        type: String, 
        required: true 
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    }
})

exports.candidateDescription = mongoose.model('candidateDescription', candidateDescriptionSchema);
exports.candidateDescriptionSchema = candidateDescriptionSchema;