const Job = require('../models/Job');
const Proposal = require('../models/Proposal');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Only clients can create)
const createJob = async (req, res) => {
    try {
        if (req.user.role !== 'client') {
            return res.status(403).json({ message: 'Only clients can post jobs' });
        }

        const { title, description, category, skillsRequired, budgetMin, budgetMax, deadline } = req.body;

        if (!title || !description || !category || budgetMin === undefined || budgetMax === undefined) {
            return res.status(400).json({ message: 'Please provide all required job details' });
        }

        // Parse skills from string or array
        let skills = skillsRequired || req.body.skills;
        if (typeof skills === 'string') {
            skills = skills.split(',').map(s => s.trim()).filter(Boolean);
        } else if (!Array.isArray(skills)) {
            skills = [];
        }

        // Create the new job object
        const job = new Job({
            client: req.user.id,
            title,
            description,
            category,
            skillsRequired: skills,
            budgetMin: Number(budgetMin),
            budgetMax: Number(budgetMax),
            deadline: deadline ? new Date(deadline) : undefined
        });

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
        const filter = {};

        // Keyword search in title or description
        if (req.query.keyword) {
            filter.$or = [
                { title: { $regex: req.query.keyword, $options: 'i' } },
                { description: { $regex: req.query.keyword, $options: 'i' } },
                { skillsRequired: { $regex: req.query.keyword, $options: 'i' } }
            ];
        }

        // Category filter
        if (req.query.category && req.query.category !== 'All Categories') {
            filter.category = req.query.category;
        }

        // Status filter: defaults to open unless requested
        if (req.query.status) {
            filter.status = req.query.status;
        } else {
            filter.status = 'open';
        }

        const jobs = await Job.find(filter)
            .populate('client', 'name email avatar company rating totalReviews')
            .sort({ createdAt: -1 });

        // Add proposals count for each job
        const jobIds = jobs.map(j => j._id);
        const proposalCounts = await Proposal.aggregate([
            { $match: { job: { $in: jobIds } } },
            { $group: { _id: '$job', count: { $sum: 1 } } }
        ]);

        const countMap = {};
        proposalCounts.forEach(pc => {
            countMap[pc._id.toString()] = pc.count;
        });

        const jobsWithCount = jobs.map(j => {
            const jobObj = j.toObject();
            jobObj.proposalsCount = countMap[j._id.toString()] || 0;
            return jobObj;
        });

        res.json(jobsWithCount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('client', 'name email avatar company location rating totalReviews');

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const proposalsCount = await Proposal.countDocuments({ job: job._id });
        const jobObj = job.toObject();
        jobObj.proposalsCount = proposalsCount;

        res.json(jobObj);
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

        if (job.client.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized to update this job' });
        }

        if (req.body.skills && !req.body.skillsRequired) {
            req.body.skillsRequired = typeof req.body.skills === 'string'
                ? req.body.skills.split(',').map(s => s.trim()).filter(Boolean)
                : req.body.skills;
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
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

        if (job.client.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized to delete this job' });
        }

        // Clean up proposals associated with this job
        await Proposal.deleteMany({ job: job._id });
        await job.deleteOne();

        res.json({ message: 'Job and related proposals removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in client's jobs
// @route   GET /api/jobs/my-jobs
// @access  Private (Only for clients)
const getMyJobs = async (req, res) => {
    try {
        if (req.user.role !== 'client' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only clients can access posted jobs' });
        }

        const jobs = await Job.find({ client: req.user.id })
            .sort({ createdAt: -1 });

        // Add proposals count for each job
        const jobIds = jobs.map(j => j._id);
        const proposalCounts = await Proposal.aggregate([
            { $match: { job: { $in: jobIds } } },
            { $group: { _id: '$job', count: { $sum: 1 } } }
        ]);

        const countMap = {};
        proposalCounts.forEach(pc => {
            countMap[pc._id.toString()] = pc.count;
        });

        const jobsWithCount = jobs.map(j => {
            const jobObj = j.toObject();
            jobObj.proposalsCount = countMap[j._id.toString()] || 0;
            return jobObj;
        });

        res.json(jobsWithCount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark a job as completed
// @route   PUT /api/jobs/:id/complete
// @access  Private (Client or Admin)
const completeJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.client.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to complete this job' });
        }

        job.status = 'completed';
        await job.save();

        res.json({ message: 'Job marked as completed successfully', job });
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
    getMyJobs,
    completeJob
};
