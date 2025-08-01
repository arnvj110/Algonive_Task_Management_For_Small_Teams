import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications
} from "../api/notifications";


export const useNotifications = () => {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await fetchNotifications();
      return data;
    },
    enabled: !!token,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => queryClient.invalidateQueries(["notifications"]),
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => queryClient.invalidateQueries(["notifications"]),
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => queryClient.invalidateQueries(["notifications"]),
  });
};

export const useAllDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: () => queryClient.invalidateQueries(["notifications"]),
  });
}