const mongoose = require('mongoose');

// Review schema for feedback after job completion
// Kaam khatam hone ke baad jo review milta hai
const reviewSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Who is giving the review
        required: true
    },
    reviewee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Who is receiving the review
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1, // Minimum 1 star
        max: 5  // Maximum 5 stars
    },
    comment: {
        type: String,
        required: true // Review ka message
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Review', reviewSchema);
