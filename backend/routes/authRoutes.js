const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');

const { signup, login } = require('../controllers/authController');
// const { testroutes } = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', signup);

// POST /api/auth/login
router.post('/login', login);

// router.get('/protected',authMiddleware, testroutes);

module.exports = router;
    