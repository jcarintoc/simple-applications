import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { commentsApi, type CreateCommentInput, type UpdateCommentInput } from "../api";

export const commentKeys = {
  all: ["comments"] as const,
  lists: () => [...commentKeys.all, "list"] as const,
  list: (postId: number) => [...commentKeys.lists(), postId] as const,
  details: () => [...commentKeys.all, "detail"] as const,
  detail: (id: number) => [...commentKeys.details(), id] as const,
};

export function useComments(postId: number) {
  return useQuery({
    queryKey: commentKeys.list(postId),
    queryFn: () => commentsApi.getCommentsByPost(postId),
    enabled: !!postId,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useComment(id: number) {
  return useQuery({
    queryKey: commentKeys.detail(id),
    queryFn: () => commentsApi.getCommentById(id),
    enabled: !!id,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, data }: { postId: number; data: CreateCommentInput }) =>
      commentsApi.createComment(postId, data),
    onSuccess: (comment) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(comment.post_id), refetchType: 'active' });
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCommentInput }) =>
      commentsApi.updateComment(id, data),
    onSuccess: (comment) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.detail(comment.id), refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: commentKeys.list(comment.post_id), refetchType: 'active' });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => commentsApi.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.lists(), refetchType: 'active' });
    },
  });
}

export function useUpvoteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => commentsApi.upvoteComment(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.detail(id), refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: commentKeys.lists(), refetchType: 'active' });
    },
  });
}
