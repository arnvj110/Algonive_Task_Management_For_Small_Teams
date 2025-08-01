import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
  useAllDeleteNotification,
} from "../hooks/useNotifications";
import { Bell, CheckCircle, AlertTriangle } from "lucide-react";

const Notifications = () => {
  const { data: notifications = [], isLoading, isError } = useNotifications();
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead } = useMarkAllAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();
  const { mutate: deleteAllNotifications } = useAllDeleteNotification();

  if (isLoading) return <div className="text-center p-8">Loading...</div>;
  if (isError) return <div className="text-center text-red-600">Failed to load notifications</div>;

  return (
    <div className="max-w-4xl mx-auto my-5">
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <div>
          {notifications.some(n => !n.read) && (
            <button
              onClick={() => markAllAsRead()}
              className="px-4 py-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Mark all as read
            </button>
          )}
          {
            notifications.length > 0 && <button
                        className="text-xs text-red-600 hover:underline dark:text-red-400
                        cursor-pointer"
                        onClick={() => deleteAllNotifications()}
                      >
                        Delete All
                      </button>
          }
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-600">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-600 dark:text-gray-300">
              You're all caught up!
            </div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification._id}
                className={`px-6 py-4 transition-colors ${
                  !notification.read
                    ? "bg-blue-50 dark:bg-blue-950"
                    : "bg-white dark:bg-gray-700"
                } hover:bg-gray-50 dark:hover:bg-gray-700`}
              >
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 ml-2">
                    <div className="flex justify-between items-center">
                      <p
                        className={`font-medium ${
                          !notification.read
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {notification.title}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {notification.message}
                    </p>
                    <div className="mt-2 flex gap-4">
                      {!notification.read && (
                        <button
                          className="text-xs text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
                          onClick={() => markAsRead(notification._id)}
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        className="text-xs text-red-600 hover:underline dark:text-red-400
                        cursor-pointer"
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
  const commonClasses = "w-5 h-5 mt-1";
  switch (type) {
    case "task_assigned":
      return <Bell className={`text-blue-500 ${commonClasses}`} />;
    case "task_completed":
      return <CheckCircle className={`text-green-500 ${commonClasses}`} />;
    case "deadline_alert":
      return <AlertTriangle className={`text-yellow-500 ${commonClasses}`} />;
    default:
      return <Bell className={`text-gray-400 ${commonClasses}`} />;
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
