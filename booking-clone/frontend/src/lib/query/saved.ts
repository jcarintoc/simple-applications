import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { savedApi } from "../api";

export const savedKeys = {
  all: ["saved"] as const,
  mine: () => [...savedKeys.all, "mine"] as const,
  check: (hotelId: number) => [...savedKeys.all, "check", hotelId] as const,
};

export function useMySaved() {
  return useQuery({
    queryKey: savedKeys.mine(),
    queryFn: savedApi.getMySaved,
  });
}

export function useCheckSaved(hotelId: number, enabled = true) {
  return useQuery({
    queryKey: savedKeys.check(hotelId),
    queryFn: () => savedApi.checkSaved(hotelId),
    enabled,
  });
}

export function useToggleSaved() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (hotelId: number) => savedApi.toggle(hotelId),
    onSuccess: (_, hotelId) => {
      queryClient.invalidateQueries({ queryKey: savedKeys.mine() });
      queryClient.invalidateQueries({ queryKey: savedKeys.check(hotelId) });
    },
  });
}
