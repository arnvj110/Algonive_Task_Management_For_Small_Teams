const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const { getTeamUsers, getCurrentUser, getUserById } = require('../controllers/userController');


router.use(authMiddleware);

router.get('/me', getCurrentUser);
router.get('/team', getTeamUsers); // List users in my team
router.get('/:id', getUserById); // Get user by ID


module.exports = router;
