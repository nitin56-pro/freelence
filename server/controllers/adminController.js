const User = require('../models/User');
const Job = require('../models/Job');
const Proposal = require('../models/Proposal');
const Review = require('../models/Review');

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all jobs (Admin only)
// @route   GET /api/admin/jobs
// @access  Private/Admin
const getAllJobsAdmin = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        const jobs = await Job.find({}).populate('client', 'name email company').sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a user (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        if (req.params.id === req.user.id) {
            return res.status(400).json({ message: 'Admin cannot delete their own account' });
        }

        const user = await User.findById(req.params.id);
        
        if (user) {
            // Delete user's jobs and proposals
            await Job.deleteMany({ client: user._id });
            await Proposal.deleteMany({ freelancer: user._id });
            await Review.deleteMany({ $or: [{ reviewer: user._id }, { reviewee: user._id }] });
            await user.deleteOne();
            res.json({ message: 'User and all related records deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a job (Admin only)
// @route   DELETE /api/admin/jobs/:id
// @access  Private/Admin
const deleteJobAdmin = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        const job = await Job.findById(req.params.id);
        if (job) {
            await Proposal.deleteMany({ job: job._id });
            await job.deleteOne();
            res.json({ message: 'Job deleted successfully' });
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get app statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        const totalUsers = await User.countDocuments();
        const totalClients = await User.countDocuments({ role: 'client' });
        const totalFreelancers = await User.countDocuments({ role: 'freelancer' });
        const totalJobs = await Job.countDocuments();
        const activeJobs = await Job.countDocuments({ status: { $in: ['open', 'in-progress'] } });
        const completedJobs = await Job.countDocuments({ status: 'completed' });
        const totalProposals = await Proposal.countDocuments();
        const totalReviews = await Review.countDocuments();

        res.json({
            users: totalUsers,
            totalUsers,
            clients: totalClients,
            freelancers: totalFreelancers,
            jobs: totalJobs,
            totalJobs,
            activeJobs,
            completedJobs,
            proposals: totalProposals,
            totalProposals,
            reviews: totalReviews,
            totalReviews
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    getAllJobsAdmin,
    deleteUser,
    deleteJobAdmin,
    getStats
};
