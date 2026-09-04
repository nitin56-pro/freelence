const express = require('express');
const router = express.Router();
const { createReview, getReviewsForUser } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

// POST /api/reviews -> Submit a new review
router.post('/', protect, createReview);

// GET /api/reviews/user/:userId -> Get reviews of a user
router.get('/user/:userId', getReviewsForUser);

module.exports = router;
