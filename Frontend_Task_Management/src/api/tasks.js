import api from "../config/api";

export const getMyTasks = async () => {
  const res = await api.get("/api/tasks/my-tasks");
  return res.data;
};

export const getTeamTasks = async () => {
  const res = await api.get("/api/tasks/team-tasks");
  return res.data;
};

export const createTask = async (taskData) => {
  
  const res = await api.post("/api/tasks/create", taskData);
  return res.data;
};
