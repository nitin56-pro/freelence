const mongoose = require('mongoose');

// Job schema defines the structure of a project/job posted by a client
// Client jo kaam post karega uski details
const jobSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model (who posted the job)
        required: true
    },
    title: {
        type: String,
        required: true // Job ka title kya hai
    },
    description: {
        type: String,
        required: true // Kaam ka poora detail
    },
    category: {
        type: String,
        required: true // Like Web Dev, Graphics Design, etc.
    },
    skillsRequired: {
        type: [String] // Example: ['React', 'Node.js']
    },
    budgetMin: {
        type: Number,
        required: true
    },
    budgetMax: {
        type: Number,
        required: true
    },
    deadline: {
        type: Date // Kab tak kaam complete chahiye
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'completed', 'cancelled'],
        default: 'open' // By default naya job 'open' rahega
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', jobSchema);
