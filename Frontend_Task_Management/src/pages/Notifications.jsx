import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
} from "../hooks/useNotifications";
import { useAuth } from "../contexts/AuthContext";
import { Bell, CheckCircle, AlertTriangle } from "lucide-react";

// (Keep your getNotificationIcon, formatDate, etc.)

const Notifications = () => {
  const { data: notifications = [], isLoading, isError } = useNotifications();
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead } = useMarkAllAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();

  if (isLoading) return <div className="text-center p-8">Loading...</div>;
  if (isError) return <div className="text-center text-red-600">Failed to load notifications</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {notifications.some(n => !n.read) && (
            <button
              onClick={() => markAllAsRead()}
              className="px-4 py-2 text-sm text-blue-600 hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="divide-y divide-gray-200">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-600">You're all caught up!</div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification._id}
                className={`px-6 py-4 hover:bg-gray-50 ${!notification.read ? "bg-blue-50" : ""}`}
              >
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className={`font-medium ${!notification.read ? "text-black" : "text-gray-600"}`}>
                        {notification.title}
                      </p>
                      <span className="text-xs text-gray-500">{formatDate(notification.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <div className="mt-2 flex gap-4">
                      {!notification.read && (
                        <button
                          className="text-xs text-blue-600 hover:underline"
                          onClick={() => markAsRead(notification._id)}
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        className="text-xs text-red-600 hover:underline"
                        onClick={() => deleteNotification(notification._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const getNotificationIcon = (type) => {
  switch (type) {
    case "task_assigned":
      return <Bell className="text-blue-500 w-5 h-5 mt-1" />;
    case "task_completed":
      return <CheckCircle className="text-green-500 w-5 h-5 mt-1" />;
    case "deadline_alert":
      return <AlertTriangle className="text-yellow-500 w-5 h-5 mt-1" />;
    default:
      return <Bell className="text-gray-400 w-5 h-5 mt-1" />;
  }
};

const formatDate = (isoString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };
  return new Date(isoString).toLocaleString("en-US", options);
};


export default Notifications;
