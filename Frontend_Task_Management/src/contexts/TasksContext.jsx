import { createContext, useContext } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useMyTasks, useTeamTasks, useCreateTask, useUpdateTask, useDeleteTask } from "../hooks/useTasks";

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();

  // Only fetch tasks if user is available
  const myTasksQuery = useMyTasks(!!user);
  const teamTasksQuery = useTeamTasks(!!user);
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask(!!user);
  const deleteTaskMutation = useDeleteTask();

  const isLoading =
    authLoading ||
    myTasksQuery.isLoading ||
    teamTasksQuery.isLoading;

  return (
    <TasksContext.Provider
      value={{
        // ✅ Provide the actual data arrays, not query objects
        myTasks: myTasksQuery.data || [],
        teamTasks: teamTasksQuery.data || [],
        
        // ✅ Provide loading states
        loading: isLoading,
        myTasksLoading: myTasksQuery.isLoading,
        teamTasksLoading: teamTasksQuery.isLoading,
        
        // ✅ Provide error states
        myTasksError: myTasksQuery.error,
        teamTasksError: teamTasksQuery.error,
        
        // ✅ Provide mutation functions
        createTask: createTaskMutation.mutateAsync,
        updateTask: updateTaskMutation,
        deleteTask: deleteTaskMutation,
        
        // ✅ Provide mutation loading states
        isCreating: createTaskMutation.isPending,
        isUpdating: updateTaskMutation.isPending,
        isDeleting: deleteTaskMutation.isPending,
        
        // ✅ Provide refetch functions for manual refresh
        refetchMyTasks: myTasksQuery.refetch,
        refetchTeamTasks: teamTasksQuery.refetch,
      }}
    >
      {!authLoading && children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
};