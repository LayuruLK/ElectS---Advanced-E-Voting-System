const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    nic: {
        type: String,
        required: true
    },
    gender: {
        type:String,
        required:true
    },
    email: {
        type: String
    },
    passwordHash: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    addressline1: {
        type: String,
        default: ''
    },
    addressline2: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    profilePhoto: {
        type: String,
        required: true
    },
    nicFront: {  // Store the URL for NIC Front image
        type: String,
        required: true
    },
    nicBack: {  // Store the URL for NIC Back image
        type: String,
        required: true
    },
    realtimePhoto: { 
        type: String, 
        required: true 
    },
    photoUpdatedAt: {
        type: Date,
        default: Date.now,
      },
    isVerified: {  // New field to track NIC verification status
        type: Boolean,
        default: false
    },
    isCandidate: {
        type: Boolean,
        required: true
    }
})

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;