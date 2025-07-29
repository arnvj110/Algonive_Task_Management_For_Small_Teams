import { createContext, useContext } from "react";

import { useAuth } from "../contexts/AuthContext";
import { useMyTasks, useTeamTasks, useCreateTask } from "../hooks/useTasks";

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();

  // Only fetch tasks if user is available
  const myTasksQuery = useMyTasks(!!user);
  const teamTasksQuery = useTeamTasks(!!user);
  const createTaskMutation = useCreateTask();

  const isLoading =
    authLoading ||
    myTasksQuery.isLoading ||
    teamTasksQuery.isLoading;

  return (
    <TasksContext.Provider
      value={{
        myTasks: myTasksQuery.data || [],
        teamTasks: teamTasksQuery.data || [],
        loading: isLoading,
        createTask: createTaskMutation.mutateAsync,
      }}
    >
      {!authLoading && children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);
