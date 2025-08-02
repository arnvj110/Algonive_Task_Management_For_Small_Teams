import { useQuery } from "@tanstack/react-query";
import { fetchUserById } from "../api/auth";

export const useUserById = (userId) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserById(userId),
    enabled: !!userId, 
  });
};
