const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
    },
    voter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,      
    },
    comment: { 
        type: String, 
        required: true 
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    }
})


exports.Comment = mongoose.model('Comment', commentSchema);
exports.commentSchema = commentSchema;