import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyTasks,
  getTeamTasks,
  createTask as createTaskApi,
} from "../api/tasks";

// Fetch current user's tasks
export const useMyTasks = (enabled = true) => {
  return useQuery({
    queryKey: ["myTasks"],
    queryFn: getMyTasks,
    enabled, // fetch only when `enabled` is true (e.g., when user is available)
  });
};

// Fetch team tasks
export const useTeamTasks = (enabled = true) => {
  return useQuery({
    queryKey: ["teamTasks"],
    queryFn: getTeamTasks,
    enabled,
  });
};

// Create a new task
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTaskApi,
    onSuccess: () => {
      // ✅ Invalidate and refetch task queries after creating a new task
      queryClient.invalidateQueries({ queryKey: ["myTasks"] });
      queryClient.invalidateQueries({ queryKey: ["teamTasks"] });
    },
  });
};
