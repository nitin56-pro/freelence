const express = require('express');
const router = express.Router();
const { getAllUsers, getAllJobsAdmin, deleteUser, getStats } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

// Admin ke routes (Login and Admin role is required)

// GET /api/admin/users
router.get('/users', protect, getAllUsers);

// GET /api/admin/jobs
router.get('/jobs', protect, getAllJobsAdmin);

// DELETE /api/admin/users/:id
router.delete('/users/:id', protect, deleteUser);

// GET /api/admin/stats
router.get('/stats', protect, getStats);

module.exports = router;
