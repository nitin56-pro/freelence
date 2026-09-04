const User = require('../models/User');
const Job = require('../models/Job');
const Proposal = require('../models/Proposal');

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        // Saare users fetch karo bina password ke
        const users = await User.find({}).select('-password');
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

        // Admin ke liye saare jobs fetch karo (kisi bhi status ke ho)
        const jobs = await Job.find({}).populate('client', 'name email');
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

        const user = await User.findById(req.params.id);
        
        if (user) {
            await user.deleteOne();
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
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

        // Admin dashboard ke liye counts nikaalo
        const totalUsers = await User.countDocuments();
        const totalJobs = await Job.countDocuments();
        const totalProposals = await Proposal.countDocuments();

        res.json({
            users: totalUsers,
            jobs: totalJobs,
            proposals: totalProposals
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    getAllJobsAdmin,
    deleteUser,
    getStats
};
