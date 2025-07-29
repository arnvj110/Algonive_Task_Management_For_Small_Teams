import api from "../config/api";

// GET all notifications
export const fetchNotifications = () => api.get("/api/notifications");

// PUT mark one as read
export const markNotificationAsRead = (id) =>
  api.put(`/api/notifications/${id}/read`);

// PATCH mark all as read
export const markAllNotificationsAsRead = () =>
  api.patch("/api/notifications/mark-all-read");

// DELETE a notification
export const deleteNotification = (id) =>
  api.delete(`/api/notifications/${id}`);
