const Notification = require('../models/Notification');

exports.getMyNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user }).sort({ createdAt: -1 });
  res.json(notifications);
};

exports.markAsRead = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ msg: "Marked as read" });
};
