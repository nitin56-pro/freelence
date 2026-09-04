const jwt = require('jsonwebtoken');

// Function to generate JWT Token
// Ye token generate karke return karega (login ke baad kaam aayega)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d' // Token 30 din baad expire hoga
    });
};

module.exports = generateToken;
