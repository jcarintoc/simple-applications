import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { commentsApi, type CreateCommentData } from "../api/comments";
import { postKeys } from "./posts";
import { toast } from "sonner";

// Query keys
export const commentKeys = {
  all: ["comments"] as const,
  postComments: (postId: number) => [...commentKeys.all, "post", postId] as const,
};

// Get comments for a post
export function useComments(postId: number, limit: number = 50, offset: number = 0) {
  return useQuery({
    queryKey: [...commentKeys.postComments(postId), limit, offset],
    queryFn: () => commentsApi.getComments(postId, limit, offset),
  });
}

// Create comment
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, data }: { postId: number; data: CreateCommentData }) =>
      commentsApi.createComment(postId, data),
    onSuccess: (response, { postId }) => {
      // Invalidate comments for this post
      queryClient.invalidateQueries({ queryKey: commentKeys.postComments(postId) });
      // Invalidate post to update comment count
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      toast.success(response.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create comment");
    },
  });
}

// Delete comment
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, postId }: { commentId: number; postId: number }) =>
      commentsApi.deleteComment(commentId),
    onSuccess: (_, { postId }) => {
      // Invalidate comments and post
      queryClient.invalidateQueries({ queryKey: commentKeys.postComments(postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      toast.success("Comment deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete comment");
    },
  });
}
