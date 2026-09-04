const Review = require('../models/Review');
const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
    try {
        const { job: jobId, reviewee, rating, comment } = req.body;

        // Verify the job exists and is completed (optional rule, but good practice)
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        // Check if review already exists for this job by this user
        // Ek job ke liye ek banda ek hi review de sakta hai
        const existingReview = await Review.findOne({
            job: jobId,
            reviewer: req.user.id
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this job' });
        }

        // Create review
        const review = new Review({
            job: jobId,
            reviewer: req.user.id,
            reviewee,
            rating,
            comment
        });

        await review.save();

        // Update User's average rating
        // Jis user ko review mila hai, uska total rating update karna hai
        const reviews = await Review.find({ reviewee });
        const totalReviews = reviews.length;
        
        // Sabhi ratings ko add karke average nikalo
        const sumRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
        const avgRating = sumRating / totalReviews;

        await User.findByIdAndUpdate(reviewee, {
            rating: avgRating,
            totalReviews: totalReviews
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all reviews for a specific user
// @route   GET /api/reviews/user/:userId
// @access  Public
const getReviewsForUser = async (req, res) => {
    try {
        // Jis user ki id di gayi hai, uske saare reviews dikhao
        const reviews = await Review.find({ reviewee: req.params.userId })
            .populate('reviewer', 'name avatar') // Kisne review diya uski info
            .populate('job', 'title'); // Kis job ke liye tha

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createReview,
    getReviewsForUser
};
