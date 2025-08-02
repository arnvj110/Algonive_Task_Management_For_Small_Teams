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
  try{
    response = await api.get("/api/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  } catch(err){
    console.log(err)
  }
  
  
  
  return response.data;
};

export const fetchUserById = async (id) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");
  let response;
  try{
    response = await api.get(`/api/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  }catch(err){
    console.log(err);
  }
  

  return response.data;
}