import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyTeam,
  createTeam,
  inviteToTeam,
  joinTeam,
  leaveTeam,
  getMyInvites,
  rejectInvite,
} from "../api/team";

// Get current user's team
export const useMyTeam = () => {
  return useQuery({
    queryKey: ["myTeam"],
    queryFn: getMyTeam,
  });
};

// Create a team
export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries(["myTeam"]);
    },
  });
};

// Invite someone to your team
export const useInviteToTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inviteToTeam,
    onSuccess: () => {
      queryClient.invalidateQueries(["myTeam"]);
    },
  });
};

// Join a team from invite
export const useJoinTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinTeam,
    onSuccess: () => {
      queryClient.invalidateQueries(["myTeam"]);
      queryClient.invalidateQueries(["myInvites"]);
    },
  });
};

// Leave the current team
export const useLeaveTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaveTeam,
    onSuccess: () => {
      queryClient.invalidateQueries(["myTeam"]);
    },
  });
};

// Get invites for current user
export const useMyInvites = () => {
  return useQuery({
    queryKey: ["myInvites"],
    queryFn: getMyInvites,
  });
};

export const useRejectInvites = () => {
    return useMutation({
        mutationFn: rejectInvite,
        onSuccess: () => {
            queryClient.invalidateQueries(['myInvites'])
        }
    })
}