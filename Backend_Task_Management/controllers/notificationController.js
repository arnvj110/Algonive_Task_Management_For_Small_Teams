const Notification = require('../models/Notification');

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching notifications", error });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.userId, read: false }, { read: true });
    res.json({ msg: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ msg: "Error updating notifications", error });
  }
};

const deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user.userId });
    res.json({ msg: "All notifications deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting all notifications", error });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ user: req.user.userId, read: false });
    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching unread count", error });
  }
};

const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ msg: "Marked as read" });
  } catch (error) {
    res.status(500).json({ msg: "Error marking notification", error });
  }
};

const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ msg: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting notification", error });
  }
};

module.exports = {
  getMyNotifications,
  markAllAsRead,
  deleteAllNotifications,
  getUnreadCount,
  markAsRead,
  deleteNotification
};
