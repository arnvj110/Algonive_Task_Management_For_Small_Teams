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
import { handleSuccess } from "../components/ui/toastFun";


// Get current user's team



export const useMyTeam = (options={}) => {
  return useQuery({
    queryKey: ["myTeam"],
    queryFn: getMyTeam,
    retry: false,
    ...options,
  });
};


// Create a team
export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries(["myTeam"]);
      handleSuccess("Team created successfully!");
    },
  });
};

// Invite someone to your team
export const useInviteToTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inviteToTeam,
    onSuccess: (data) => {
      
      queryClient.invalidateQueries(["myTeam"]);
      handleSuccess(data.message);
    },
    onError: (error) => {
      console.error("Invite failed:", error?.response?.data || error.message);
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