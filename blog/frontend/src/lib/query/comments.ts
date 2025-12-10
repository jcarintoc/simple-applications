import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { commentsApi, csrfApi } from "../api";
import type { CreateCommentInput } from "../api";

export const useGetCommentsByPostId = (postId: number) => {
  return useQuery({
    queryKey: ["comments", "post", postId],
    queryFn: () => commentsApi.getCommentsByPostId(postId),
    enabled: !!postId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, input }: { postId: number; input: CreateCommentInput }) => {
      const { token } = await csrfApi.getCsrfToken();
      return commentsApi.createComment(postId, input, token);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", "post", variables.postId] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: number; postId: number }) => {
      const { token } = await csrfApi.getCsrfToken();
      return commentsApi.deleteComment(id, token);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", "post", variables.postId] });
    },
  });
};
