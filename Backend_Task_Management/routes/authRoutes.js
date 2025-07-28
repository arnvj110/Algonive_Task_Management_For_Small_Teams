const express = require('express');
const { register, login, getCurrentUser } = require('../controllers/authController');
const { signupValidation, loginValidation } = require('../middlewares/validateAuth');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();




router.post('/register', signupValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
