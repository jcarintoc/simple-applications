import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyProfile, getProfile, updateProfile, getSuggestedUsers } from "../api/profiles";
import type { UpdateProfileInput } from "../api/types";

export const profileKeys = {
  all: ["profiles"] as const,
  me: () => [...profileKeys.all, "me"] as const,
  detail: (userId: number) => [...profileKeys.all, "detail", userId] as const,
  suggested: () => [...profileKeys.all, "suggested"] as const,
};

export function useMyProfile() {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: getMyProfile,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProfile(userId: number) {
  return useQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: () => getProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => updateProfile(data),
    onSuccess: (profile) => {
      queryClient.setQueryData(profileKeys.me(), profile);
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}

export function useSuggestedUsers(limit?: number) {
  return useQuery({
    queryKey: profileKeys.suggested(),
    queryFn: () => getSuggestedUsers(limit),
    staleTime: 2 * 60 * 1000,
  });
}
