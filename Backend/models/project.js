const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,      
    },
    description: { 
        type: String, 
        required: true 
    },
    links: {
        type: String,
    },
    attachments: [{
        type: String
    }],
    isReviewed: {
        type: Boolean,
        default: false
    },
})


exports.Project = mongoose.model('Project', projectSchema);
exports.projectSchema = projectSchema;