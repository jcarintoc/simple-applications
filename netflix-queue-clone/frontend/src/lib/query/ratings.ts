import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ratingsApi, type RatingInput } from "../api";
import { titlesKeys } from "./titles";

export function useRateTitle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ titleId, data }: { titleId: number; data: RatingInput }) =>
      ratingsApi.rateTitle(titleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: titlesKeys.all });
    },
  });
}

export function useRemoveRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ratingsApi.removeRating,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: titlesKeys.all });
    },
  });
}