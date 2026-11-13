const Review = require('../models/Review');
const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
    try {
        const { job: jobId, reviewee, rating, comment } = req.body;

        if (!jobId || !reviewee || !rating || !comment) {
            return res.status(400).json({ message: 'All review fields are required' });
        }

        // Verify the job exists
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        // Check if review already exists for this job by this user
        const existingReview = await Review.findOne({
            job: jobId,
            reviewer: req.user.id
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this project' });
        }

        // Create review
        const review = new Review({
            job: jobId,
            reviewer: req.user.id,
            reviewee,
            rating: Number(rating),
            comment
        });

        await review.save();

        // Update User's average rating
        const reviews = await Review.find({ reviewee });
        const totalReviews = reviews.length;
        
        const sumRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
        const avgRating = totalReviews > 0 ? Math.round((sumRating / totalReviews) * 10) / 10 : 0;

        await User.findByIdAndUpdate(reviewee, {
            rating: avgRating,
            totalReviews: totalReviews
        });

        const populatedReview = await Review.findById(review._id)
            .populate('reviewer', 'name avatar role')
            .populate('job', 'title');

        res.status(201).json(populatedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all reviews for a specific user
// @route   GET /api/reviews/user/:userId
// @access  Public
const getReviewsForUser = async (req, res) => {
    try {
        const reviews = await Review.find({ reviewee: req.params.userId })
            .populate('reviewer', 'name avatar role')
            .populate('job', 'title')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all reviews for a specific job
// @route   GET /api/reviews/job/:jobId
// @access  Public
const getReviewsForJob = async (req, res) => {
    try {
        const reviews = await Review.find({ job: req.params.jobId })
            .populate('reviewer', 'name avatar role')
            .populate('reviewee', 'name avatar role');

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createReview,
    getReviewsForUser,
    getReviewsForJob
};
