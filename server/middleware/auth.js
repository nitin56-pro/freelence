const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes (check if user is logged in)
const protect = async (req, res, next) => {
    let token;

    // Check if token is in the headers (Bearer token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using JWT_SECRET
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user by id from token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'User account not found or deactivated' });
            }

            return next();
        } catch (error) {
            console.error('JWT Token Verification Error:', error.message);
            return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no authorization token provided' });
    }
};

module.exports = { protect };
