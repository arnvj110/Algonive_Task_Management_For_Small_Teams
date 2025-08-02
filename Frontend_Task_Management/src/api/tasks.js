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

export const updateTaskApi = async (taskId, updatedTaskData) => {
  try {
    const res = await api.put(`/api/tasks/${taskId}`, updatedTaskData);
    return res.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

export const deleteTaskApi = async (taskId) => {
  try {
    const res = await api.delete(`/api/tasks/${taskId}`);
    return res.data; // Return the response data
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};