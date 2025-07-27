const Notification = require('../models/Notification');

// Get all notifications for the logged-in user
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching notifications", error });
  }
};

// Mark a specific notification as read
exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ msg: "Marked as read" });
  } catch (error) {
    res.status(500).json({ msg: "Error marking notification", error });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user, read: false }, { read: true });
    res.json({ msg: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ msg: "Error updating notifications", error });
  }
};

// Delete a specific notification
exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ msg: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting notification", error });
  }
};

// Delete all notifications for the user
exports.deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user });
    res.json({ msg: "All notifications deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting all notifications", error });
  }
};

// Get count of unread notifications (for badges)
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ user: req.user, read: false });
    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching unread count", error });
  }
};
