import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyTasks,
  getTeamTasks,
  createTask as createTaskApi,
  
  
  updateTaskApi,
  deleteTaskApi,
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


export const useUpdateTask = (enabled = true) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, updates }) => updateTaskApi(taskId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTasks"] });
      queryClient.invalidateQueries({ queryKey: ["teamTasks"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.error("Task operation failed:", error);
    },
    enabled
  });
};


export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTaskApi,
    onSuccess: () => {
      // ✅ Invalidate and refetch task queries after deleting a task
      queryClient.invalidateQueries({ queryKey: ["myTasks"] });
      queryClient.invalidateQueries({ queryKey: ["teamTasks"] });
    },onError: (error) => {
  console.error("Task operation failed:", error);
}

  });
}