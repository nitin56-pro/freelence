const express = require('express');
const router = express.Router();
const { createJob, getAllJobs, getJobById, updateJob, deleteJob, getMyJobs, completeJob } = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

// Job se related saare routes

// GET /api/jobs -> Get all open jobs
router.get('/', getAllJobs);

// GET /api/jobs/my-jobs -> Get logged in client's jobs
router.get('/my-jobs', protect, getMyJobs);

// GET /api/jobs/:id -> Get single job
router.get('/:id', getJobById);

// POST /api/jobs -> Create new job (needs login)
router.post('/', protect, createJob);

// PUT /api/jobs/:id -> Update job (needs login)
router.put('/:id', protect, updateJob);

// PUT /api/jobs/:id/complete -> Mark job as completed
router.put('/:id/complete', protect, completeJob);

// DELETE /api/jobs/:id -> Delete job (needs login)
router.delete('/:id', protect, deleteJob);

module.exports = router;
