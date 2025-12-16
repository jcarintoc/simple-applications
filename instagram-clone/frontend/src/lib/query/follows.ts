import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { followsApi } from "../api";

export const followKeys = {
  all: ["follows"] as const,
  following: (userId: number) => [...followKeys.all, "following", userId] as const,
  followers: (userId: number) => [...followKeys.all, "followers", userId] as const,
  check: (userId: number) => [...followKeys.all, "check", userId] as const,
};

export function useFollowing(userId: number) {
  return useQuery({
    queryKey: followKeys.following(userId),
    queryFn: () => followsApi.getFollowing(userId),
    enabled: !!userId,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useFollowers(userId: number) {
  return useQuery({
    queryKey: followKeys.followers(userId),
    queryFn: () => followsApi.getFollowers(userId),
    enabled: !!userId,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useIsFollowing(userId: number) {
  return useQuery({
    queryKey: followKeys.check(userId),
    queryFn: () => followsApi.isFollowing(userId),
    enabled: !!userId,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => followsApi.followUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: followKeys.check(userId), refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: followKeys.following(userId), refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: followKeys.followers(userId), refetchType: 'active' });
    },
  });
}

export function useUnfollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => followsApi.unfollowUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: followKeys.check(userId), refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: followKeys.following(userId), refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: followKeys.followers(userId), refetchType: 'active' });
    },
  });
}
