import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postsApi, type CreatePostData, type Post } from "../api/posts";
import { toast } from "sonner";

// Query keys
export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (limit?: number, offset?: number) => [...postKeys.lists(), { limit, offset }] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
  userPosts: (userId: number) => [...postKeys.all, "user", userId] as const,
};

// Get feed
export function useFeed(limit: number = 50, offset: number = 0) {
  return useQuery({
    queryKey: postKeys.list(limit, offset),
    queryFn: () => postsApi.getFeed(limit, offset),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get single post
export function usePost(id: number) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postsApi.getPost(id),
    staleTime: 1000 * 60 * 5,
  });
}

// Get user posts
export function useUserPosts(userId: number, limit: number = 50, offset: number = 0) {
  return useQuery({
    queryKey: [...postKeys.userPosts(userId), limit, offset],
    queryFn: () => postsApi.getUserPosts(userId, limit, offset),
    staleTime: 1000 * 60 * 5,
  });
}

// Create post
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostData) => postsApi.createPost(data),
    onSuccess: (response) => {
      // Invalidate feed queries
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      toast.success(response.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create post");
    },
  });
}

// Delete post
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postsApi.deletePost(id),
    onSuccess: (_, postId) => {
      // Remove from cache
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.removeQueries({ queryKey: postKeys.detail(postId) });
      toast.success("Post deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete post");
    },
  });
}
