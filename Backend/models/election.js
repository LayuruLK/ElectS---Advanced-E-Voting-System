const mongoose = require('mongoose');

const electionSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    where: {
        type: String,
        required: true,      
    },
    date: { 
        type: Date, 
        required: true 
    },
    startTime: { 
        type: String, 
        required: true,
        
    },
    endTime: { 
        type: String, 
        required: true,
        
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
    }]
});

exports.Election = mongoose.model('Election', electionSchema);
exports.electionSchema = electionSchema;
