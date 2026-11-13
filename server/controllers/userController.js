const User = require('../models/User');

// @desc    Get user profile data
// @route   GET /api/users/profile
// @access  Private (Needs token)
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id || req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id || req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update basic fields
        if (req.body.name) user.name = req.body.name;
        if (req.body.bio !== undefined) user.bio = req.body.bio;
        if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
        if (req.body.location !== undefined) user.location = req.body.location;

        // For freelancers
        if (req.body.skills !== undefined) {
            if (typeof req.body.skills === 'string') {
                user.skills = req.body.skills.split(',').map(s => s.trim()).filter(Boolean);
            } else if (Array.isArray(req.body.skills)) {
                user.skills = req.body.skills;
            }
        }
        if (req.body.hourlyRate !== undefined) {
            user.hourlyRate = Number(req.body.hourlyRate) || 0;
        }

        // For clients
        if (req.body.company !== undefined) {
            user.company = req.body.company;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            avatar: updatedUser.avatar || '',
            bio: updatedUser.bio || '',
            skills: updatedUser.skills || [],
            hourlyRate: updatedUser.hourlyRate || 0,
            company: updatedUser.company || '',
            location: updatedUser.location || '',
            rating: updatedUser.rating || 0,
            totalReviews: updatedUser.totalReviews || 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get any user by ID (Public profile)
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getUserById
};
