const User = require('../models/User');

// @desc    Get user profile data
// @route   GET /api/users/profile
// @access  Private (Needs token)
const getProfile = async (req, res) => {
    try {
        // req.user comes from the auth middleware
        // Auth middleware ne verify karke req.user me daal diya tha
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        // Find user by the logged in user ID
        const user = await User.findById(req.user.id);

        if (user) {
            // Update fields if provided, otherwise keep the old one
            // Agar nayi value aayi hai toh update karo, warna purani rehne do
            user.name = req.body.name || user.name;
            user.bio = req.body.bio || user.bio;
            user.avatar = req.body.avatar || user.avatar;
            user.location = req.body.location || user.location;
            
            // For freelancers
            if (req.body.skills) user.skills = req.body.skills;
            if (req.body.hourlyRate) user.hourlyRate = req.body.hourlyRate;
            
            // For clients
            if (req.body.company) user.company = req.body.company;

            // Save the updated user
            const updatedUser = await user.save();

            // Send back the updated details without password
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                bio: updatedUser.bio,
                skills: updatedUser.skills,
                hourlyRate: updatedUser.hourlyRate,
                company: updatedUser.company,
                location: updatedUser.location
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get any user by ID (Public profile)
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res) => {
    try {
        // Find user by ID from URL params and don't show password
        // Password ko hide kar do (-password)
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
