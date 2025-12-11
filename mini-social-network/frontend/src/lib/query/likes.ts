import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { likesApi } from "../api/likes";
import { postKeys } from "./posts";
import { toast } from "sonner";
import type { Post } from "../api/posts";

// Query keys
export const likeKeys = {
  all: ["likes"] as const,
  postLikes: (postId: number) => [...likeKeys.all, "post", postId] as const,
};

// Get users who liked a post
export function usePostLikes(postId: number, limit: number = 50, offset: number = 0) {
  return useQuery({
    queryKey: [...likeKeys.postLikes(postId), limit, offset],
    queryFn: () => likesApi.getPostLikes(postId, limit, offset),
  });
}

// Like post
export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => likesApi.likePost(postId),
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) });
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });

      // Optimistic update
      queryClient.setQueriesData<{ posts: Post[] }>({ queryKey: postKeys.lists() }, (old) => {
        if (!old) return old;
        return {
          posts: old.posts.map((post) =>
            post.id === postId
              ? { ...post, isLiked: true, likeCount: post.likeCount + 1 }
              : post
          ),
        };
      });

      queryClient.setQueryData<{ post: Post }>(postKeys.detail(postId), (old) => {
        if (!old) return old;
        return {
          post: { ...old.post, isLiked: true, likeCount: old.post.likeCount + 1 },
        };
      });
    },
    onError: (error: Error, postId) => {
      // Revert optimistic update
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      toast.error(error.message || "Failed to like post");
    },
    onSettled: (_, __, postId) => {
      queryClient.invalidateQueries({ queryKey: likeKeys.postLikes(postId) });
    },
  });
}

// Unlike post
export function useUnlikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => likesApi.unlikePost(postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) });
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });

      // Optimistic update
      queryClient.setQueriesData<{ posts: Post[] }>({ queryKey: postKeys.lists() }, (old) => {
        if (!old) return old;
        return {
          posts: old.posts.map((post) =>
            post.id === postId
              ? { ...post, isLiked: false, likeCount: Math.max(0, post.likeCount - 1) }
              : post
          ),
        };
      });

      queryClient.setQueryData<{ post: Post }>(postKeys.detail(postId), (old) => {
        if (!old) return old;
        return {
          post: { ...old.post, isLiked: false, likeCount: Math.max(0, old.post.likeCount - 1) },
        };
      });
    },
    onError: (error: Error, postId) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      toast.error(error.message || "Failed to unlike post");
    },
    onSettled: (_, __, postId) => {
      queryClient.invalidateQueries({ queryKey: likeKeys.postLikes(postId) });
    },
  });
}
