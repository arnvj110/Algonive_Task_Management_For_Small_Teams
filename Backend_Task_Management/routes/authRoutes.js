const express = require('express');
const { register, login } = require('../controllers/authController');
const { signupValidation, loginValidation } = require('../middlewares/validateAuth');
const router = express.Router();




router.post('/register', signupValidation, register);
router.post('/login', loginValidation, login);

module.exports = router;
