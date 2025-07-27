const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const { getTeamUsers } = require('../controllers/userController');


router.use(authMiddleware);

router.get('/team', getTeamUsers); // List users in my team

module.exports = router;
