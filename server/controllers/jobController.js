const Job = require('../models/Job');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Only clients can create)
const createJob = async (req, res) => {
    try {
        // Check if user is a client
        // Sirf client hi job bana sakta hai
        if (req.user.role !== 'client') {
            return res.status(403).json({ message: 'Only clients can post jobs' });
        }

        const { title, description, category, skillsRequired, budgetMin, budgetMax, deadline } = req.body;

        // Create the new job object
        const job = new Job({
            client: req.user.id, // Current logged in user is the client
            title,
            description,
            category,
            skillsRequired,
            budgetMin,
            budgetMax,
            deadline
        });

        // Save it to database
        const createdJob = await job.save();
        res.status(201).json(createdJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all open jobs
// @route   GET /api/jobs
// @access  Public
const getAllJobs = async (req, res) => {
    try {
        // Simple search functionality
        // Agar keyword pass kiya hai (ex: ?keyword=React)
        const keyword = req.query.keyword ? {
            title: {
                $regex: req.query.keyword,
                $options: 'i' // Case insensitive search
            }
        } : {};

        // Find all jobs that are 'open', also handle category filter if passed
        const filter = { ...keyword, status: 'open' };
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // Fetch from DB and also load client name (populate)
        // Client ki detail bhi saath me aayegi
        const jobs = await Job.find(filter).populate('client', 'name avatar');
        
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    try {
        // ID ke basis par job dhundo
        const job = await Job.findById(req.params.id).populate('client', 'name avatar company');

        if (job) {
            res.json(job);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if the current user is the owner of this job
        // Check karo ki ye job isi user ne banayi thi ya nahi
        if (job.client.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to update this job' });
        }

        // Update the job
        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // Return updated document
        );

        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check ownership
        if (job.client.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to delete this job' });
        }

        // Delete from database
        await job.deleteOne();
        res.json({ message: 'Job removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in client's jobs
// @route   GET /api/jobs/my-jobs
// @access  Private (Only for clients)
const getMyJobs = async (req, res) => {
    try {
        if (req.user.role !== 'client') {
            return res.status(403).json({ message: 'Only clients have their own jobs' });
        }

        // Fetch all jobs created by this user
        const jobs = await Job.find({ client: req.user.id });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getMyJobs
};
