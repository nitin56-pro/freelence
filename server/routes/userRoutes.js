const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getUserById } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const { registerUser, loginUser } = require('../controllers/authController');

// Auth routes aliases for client compatibility
router.post('/register', registerUser);
router.post('/login', loginUser);

// Profile manage karne ke routes
// 'protect' ka matlab hai ki login (token) zaroori hai is route ke liye

// Get & Update Profile (for the logged-in user)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Get any user by ID (public route)
router.get('/:id', getUserById);

module.exports = router;
