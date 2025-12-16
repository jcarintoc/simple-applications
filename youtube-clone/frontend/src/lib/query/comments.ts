import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getComments, createComment, updateComment, deleteComment } from "../api/comments";
import type { CreateCommentInput } from "../api/types";
import { videoKeys } from "./videos";

export const commentKeys = {
  all: ["comments"] as const,
  byVideo: (videoId: number) => [...commentKeys.all, "video", videoId] as const,
};

export function useComments(videoId: number) {
  return useQuery({
    queryKey: commentKeys.byVideo(videoId),
    queryFn: () => getComments(videoId),
    staleTime: 1000 * 30,
    enabled: videoId > 0,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ videoId, data }: { videoId: number; data: CreateCommentInput }) =>
      createComment(videoId, data),
    onSuccess: (_, { videoId }) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byVideo(videoId) });
      queryClient.invalidateQueries({ queryKey: videoKeys.detail(videoId) });
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, videoId, data }: { id: number; videoId: number; data: CreateCommentInput }) =>
      updateComment(id, data),
    onSuccess: (_, { videoId }) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byVideo(videoId) });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number; videoId: number }) => deleteComment(id),
    onSuccess: (_, { videoId }) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byVideo(videoId) });
      queryClient.invalidateQueries({ queryKey: videoKeys.detail(videoId) });
    },
  });
}
