import api from "../config/api";

export const loginUser = async (email, password) => {
  const res = await api.post("/api/auth/login", { email, password });
  return res.data;
};

export const registerUser = async (username, email, password) => {
  const res = await api.post("/api/auth/register", { username, email, password });
  return res.data;
};

export const fetchCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");
  let response;
  try {
    response = await api.get("/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    console.log(err);
    throw err; 
  }
  return response.data;
};

export const fetchUserById = async (id) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");
  let response;
  try {
    response = await api.get(`/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    console.log(err);
    throw err; 
  }
  return response.data;
}

export const updateUserProfile = async (userData) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");
  
  try {
    const response = await api.put("/api/users/me", userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err.response?.data?.message || "Failed to update profile";
  }
};

export const deleteUserAccount = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");
  
  try {
    const response = await api.delete("/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err.response?.data?.message || "Failed to delete account";
  }
};