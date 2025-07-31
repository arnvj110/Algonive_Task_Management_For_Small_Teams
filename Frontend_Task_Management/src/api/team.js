import api from "../config/api";

// Create a new team
export const createTeam = async (name) => {
  const res = await api.post("/api/teams", { name });
  return res.data;
};

// Get current user's team
export const getMyTeam = async () => {
  const res = await api.get("/api/teams/my");
  return res.data;
};

// Invite a user to team
export const inviteToTeam = async (email) => {
  const res = await api.post("/api/teams/invite", { email });
  return res.data;
};

// Join a specific team
export const joinTeam = async (teamId) => {
  const res = await api.post("/api/teams/join", { teamId });
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