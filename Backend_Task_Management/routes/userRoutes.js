const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const { getTeamUsers, getCurrentUser, getUserById, updateCurrentUser, deleteCurrentUser } = require('../controllers/userController');


router.use(authMiddleware);

router.get('/me', getCurrentUser);
router.get('/team', getTeamUsers); // List users in my team
router.get('/:id', getUserById); // Get user by ID
router.put('/me', updateCurrentUser);
router.delete('/me', deleteCurrentUser);


module.exports = router;
