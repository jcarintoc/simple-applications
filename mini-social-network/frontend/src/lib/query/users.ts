import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../api/users";

// Query keys
export const userKeys = {
  all: ["users"] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

// Get user profile
export function useUserProfile(userId: number) {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => usersApi.getUserProfile(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
