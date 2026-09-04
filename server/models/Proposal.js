const mongoose = require('mongoose');

// Proposal schema defines the structure of a bid submitted by a freelancer
// Jab freelancer kisi job par apply karta hai
const proposalSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coverLetter: {
        type: String,
        required: true // Freelancer ka message client ke liye
    },
    proposedBudget: {
        type: Number,
        required: true // Kitne paise me kaam karega
    },
    deliveryDays: {
        type: Number,
        required: true // Kitne din me kaam dega
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending' // Default status is pending
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Proposal', proposalSchema);
