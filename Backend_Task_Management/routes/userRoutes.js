const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const { getTeamUsers, getCurrentUser } = require('../controllers/userController');


router.use(authMiddleware);

router.get('/me', getCurrentUser);
router.get('/team', getTeamUsers); // List users in my team

module.exports = router;
