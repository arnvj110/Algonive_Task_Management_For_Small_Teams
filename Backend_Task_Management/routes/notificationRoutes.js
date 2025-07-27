const express = require('express');
const router = express.Router();

const { getMyNotifications, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications } = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');


router.use(authMiddleware); // protect all routes

router.get('/', getMyNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/:id/read', markAsRead);
router.put('/mark-all-read', markAllAsRead);
router.delete('/:id', deleteNotification);
router.delete('/', deleteAllNotifications);

module.exports = router;
