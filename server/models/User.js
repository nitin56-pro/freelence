const mongoose = require('mongoose');

// User schema defines the structure of a user in the database
// User ki details save karne ke liye schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // Name is compulsory
    },
    email: {
        type: String,
        required: true,
        unique: true // Email should not be duplicated
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['freelancer', 'client', 'admin'], // 3 types ke roles ho sakte hain
        default: 'freelancer'
    },
    avatar: {
        type: String,
        default: '' // Profile picture link
    },
    bio: {
        type: String,
        default: '' // Short description about the user
    },
    skills: {
        type: [String] // Array of skills for freelancers
    },
    hourlyRate: {
        type: Number,
        default: 0
    },
    company: {
        type: String // For clients
    },
    location: {
        type: String
    },
    rating: {
        type: Number,
        default: 0 // Average rating based on reviews
    },
    totalReviews: {
        type: Number,
        default: 0 // Number of reviews received
    },
    createdAt: {
        type: Date,
        default: Date.now // Registration date
    }
});

// Create and export the model
module.exports = mongoose.model('User', userSchema);
