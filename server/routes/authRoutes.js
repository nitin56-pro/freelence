const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Routes definitions
// Jaise hi koi in URLs par aayega, uske hisaab se function call hoga
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
