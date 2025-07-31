import { handleError } from "../components/ui/toastFun";
import api from "../config/api";

// Create a new team
export const createTeam = async (name) => {
  try {

    const res = await api.post("/api/teams/create",  name );
    return res.data;
  } catch (error) {
    console.log(error);
    handleError(error?.response?.data?.error);
  }
};

// Get current user's team
export const getMyTeam = async () => {
  try {
    const res = await api.get("/api/teams/my");
    return res.data;
  } catch (err) {
    const errorMessage = err.response?.data?.error || "Failed to fetch team.";
    handleError(errorMessage);
    throw new Error(errorMessage);
  }
};


// Invite a user to team

export const inviteToTeam = async (email) => {
  try {
    const res = await api.post("/api/teams/invite", email );
    return res.data;
  } catch (err) {
    console.error("Invite failed", err.response?.data || err.message);
    throw err;
  }
};


// Join a specific team
export const joinTeam = async (teamId) => {
  const res = await api.post("/api/teams/join",  teamId );
  return res.data;
};

// Leave the current team
export const leaveTeam = async () => {
  const res = await api.post("/api/teams/leave");
  return res.data;
};

// Get invites sent to the current user
export const getMyInvites = async () => {
  const res = await api.get("/api/teams/invites");
  return res.data;
};

export const rejectInvite = async (id) => {
  const res = await api.delete(`/api/teams/invites/${id}`);
  return res.data;
}