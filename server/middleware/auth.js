const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes (check if user is logged in)
// Ye function check karega ki user logged in hai ya nahi
const protect = async (req, res, next) => {
    let token;

    // Check if token is in the headers (Bearer token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (split by space, token is 2nd part)
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using JWT_SECRET
            // Token sahi hai ya nahi verify karte hain
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user by id from token, and attach it to req.user
            // Password ko exclude karte hain (-password)
            req.user = await User.findById(decoded.id).select('-password');

            // Go to the next function
            next();
        } catch (error) {
            console.error(error);
            // Agar token invalid hai ya expire ho gaya
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // Agar token mila hi nahi
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
