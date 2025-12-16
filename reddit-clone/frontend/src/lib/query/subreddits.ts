import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subredditsApi, type CreateSubredditInput, type UpdateSubredditInput } from "../api";

export const subredditKeys = {
  all: ["subreddits"] as const,
  lists: () => [...subredditKeys.all, "list"] as const,
  details: () => [...subredditKeys.all, "detail"] as const,
  detail: (id: number) => [...subredditKeys.details(), id] as const,
};

export function useSubreddits() {
  return useQuery({
    queryKey: subredditKeys.lists(),
    queryFn: () => subredditsApi.getSubreddits(),
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useSubreddit(id: number) {
  return useQuery({
    queryKey: subredditKeys.detail(id),
    queryFn: () => subredditsApi.getSubredditById(id),
    enabled: !!id,
  });
}

export function useCreateSubreddit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubredditInput) => subredditsApi.createSubreddit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subredditKeys.lists(), refetchType: 'active' });
    },
  });
}

export function useUpdateSubreddit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSubredditInput }) =>
      subredditsApi.updateSubreddit(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: subredditKeys.detail(id), refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: subredditKeys.lists(), refetchType: 'active' });
    },
  });
}

export function useDeleteSubreddit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => subredditsApi.deleteSubreddit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subredditKeys.lists(), refetchType: 'active' });
    },
  });
}
