const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const { getMyNotifications } = require('../controllers/notificationController');




router.get('/', authMiddleware, getMyNotifications); // Fetch logged-in user's notifications

module.exports = router;
