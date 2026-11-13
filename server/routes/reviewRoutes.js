const express = require('express');
const router = express.Router();
const { createReview, getReviewsForUser, getReviewsForJob } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

// POST /api/reviews -> Submit a new review
router.post('/', protect, createReview);

// GET /api/reviews/user/:userId -> Get reviews of a user
router.get('/user/:userId', getReviewsForUser);

// GET /api/reviews/job/:jobId -> Get reviews of a job
router.get('/job/:jobId', getReviewsForJob);

module.exports = router;
