import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { continueWatchingApi, type ProgressInput } from "../api";

export const continueWatchingKeys = {
  all: ["continueWatching"] as const,
  lists: () => [...continueWatchingKeys.all, "list"] as const,
  list: () => [...continueWatchingKeys.lists()] as const,
};

export function useContinueWatching() {
  return useQuery({
    queryKey: continueWatchingKeys.list(),
    queryFn: continueWatchingApi.getContinueWatching,
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ titleId, data }: { titleId: number; data: ProgressInput }) =>
      continueWatchingApi.updateProgress(titleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: continueWatchingKeys.all });
    },
  });
}

export function useRemoveFromContinueWatching() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: continueWatchingApi.removeFromContinueWatching,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: continueWatchingKeys.all });
    },
  });
}

export function useClearContinueWatching() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: continueWatchingApi.clearAll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: continueWatchingKeys.all });
    },
  });
}