const express = require('express');
const router = express.Router();
const { getAllUsers, getAllJobsAdmin, deleteUser, deleteJobAdmin, getStats } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

// Admin ke routes (Login and Admin role is required)

// GET /api/admin/users
router.get('/users', protect, getAllUsers);

// GET /api/admin/jobs
router.get('/jobs', protect, getAllJobsAdmin);

// DELETE /api/admin/users/:id
router.delete('/users/:id', protect, deleteUser);

// DELETE /api/admin/jobs/:id
router.delete('/jobs/:id', protect, deleteJobAdmin);

// GET /api/admin/stats
router.get('/stats', protect, getStats);

module.exports = router;
