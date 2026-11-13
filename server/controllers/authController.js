const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if all fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user already exists
        // Check karte hain ki email pehle se use toh nahi hua
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password before saving to database
        // Password ko encrypt (hash) kar rahe hain for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'freelancer' // default to freelancer if no role
        });

        if (user) {
            // Return user details and a token
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar || '',
                bio: user.bio || '',
                skills: user.skills || [],
                hourlyRate: user.hourlyRate || 0,
                company: user.company || '',
                location: user.location || '',
                rating: user.rating || 0,
                totalReviews: user.totalReviews || 0,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Find user by email
        // Email se database me user search karo
        const user = await User.findOne({ email });

        // Check if user exists and password matches
        // User mil gaya aur password match ho gaya
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar || '',
                bio: user.bio || '',
                skills: user.skills || [],
                hourlyRate: user.hourlyRate || 0,
                company: user.company || '',
                location: user.location || '',
                rating: user.rating || 0,
                totalReviews: user.totalReviews || 0,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser
};
