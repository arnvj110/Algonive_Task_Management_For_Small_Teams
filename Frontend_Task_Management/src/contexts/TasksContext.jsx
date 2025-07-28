import { createContext, useContext, useState, useEffect } from "react";
import api from "../config/api";

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [teamTasks, setTeamTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTeamTasks = async () => {
    try {
      const res = await api.get("/api/tasks/team-tasks");
      setTeamTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch team tasks:", err);
    }
  };

  const fetchMyTasks = async () => {
    try {
      const res = await api.get("/api/tasks/my-tasks");
      setMyTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch my tasks:", err);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    await Promise.all([fetchTeamTasks(), fetchMyTasks()]);
    setLoading(false);
  };

  const createTask = async (taskData) => {
    try {
      const res = await api.post("/api/tasks/create", taskData);
      // Optionally add new task to teamTasks or myTasks based on your app logic:
      setTeamTasks((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TasksContext.Provider
      value={{
        teamTasks,
        myTasks,
        loading,
        fetchTasks,
        createTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);
