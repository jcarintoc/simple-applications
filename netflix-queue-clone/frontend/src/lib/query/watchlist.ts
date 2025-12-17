import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { watchlistApi } from "../api";
import { titlesKeys } from "./titles";

export const watchlistKeys = {
  all: ["watchlist"] as const,
  lists: () => [...watchlistKeys.all, "list"] as const,
  list: () => [...watchlistKeys.lists()] as const,
};

export function useWatchlist() {
  return useQuery({
    queryKey: watchlistKeys.list(),
    queryFn: watchlistApi.getWatchlist,
  });
}

export function useToggleWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: watchlistApi.toggleWatchlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
      queryClient.invalidateQueries({ queryKey: titlesKeys.all });
    },
  });
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: watchlistApi.addToWatchlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
      queryClient.invalidateQueries({ queryKey: titlesKeys.all });
    },
  });
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: watchlistApi.removeFromWatchlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
      queryClient.invalidateQueries({ queryKey: titlesKeys.all });
    },
  });
}