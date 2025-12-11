import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { followsApi } from "../api/follows";
import { userKeys } from "./users";
import { toast } from "sonner";

// Query keys
export const followKeys = {
  all: ["follows"] as const,
  followers: (userId: number) => [...followKeys.all, "followers", userId] as const,
  following: (userId: number) => [...followKeys.all, "following", userId] as const,
  isFollowing: (userId: number) => [...followKeys.all, "isFollowing", userId] as const,
};

// Get followers
export function useFollowers(userId: number, limit: number = 50, offset: number = 0) {
  return useQuery({
    queryKey: [...followKeys.followers(userId), limit, offset],
    queryFn: () => followsApi.getFollowers(userId, limit, offset),
  });
}

// Get following
export function useFollowing(userId: number, limit: number = 50, offset: number = 0) {
  return useQuery({
    queryKey: [...followKeys.following(userId), limit, offset],
    queryFn: () => followsApi.getFollowing(userId, limit, offset),
  });
}

// Check if following
export function useIsFollowing(userId: number) {
  return useQuery({
    queryKey: followKeys.isFollowing(userId),
    queryFn: () => followsApi.checkFollowing(userId),
    staleTime: 1000 * 60 * 5,
  });
}

// Follow user
export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => followsApi.followUser(userId),
    onSuccess: (response, userId) => {
      // Invalidate follow queries
      queryClient.invalidateQueries({ queryKey: followKeys.isFollowing(userId) });
      queryClient.invalidateQueries({ queryKey: followKeys.followers(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      toast.success(response.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to follow user");
    },
  });
}

// Unfollow user
export function useUnfollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => followsApi.unfollowUser(userId),
    onSuccess: (response, userId) => {
      // Invalidate follow queries
      queryClient.invalidateQueries({ queryKey: followKeys.isFollowing(userId) });
      queryClient.invalidateQueries({ queryKey: followKeys.followers(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      toast.success(response.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to unfollow user");
    },
  });
}
