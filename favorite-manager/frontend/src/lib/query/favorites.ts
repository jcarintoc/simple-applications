import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { favoritesApi, type CreateFavoriteInput, type UpdateFavoriteInput } from "../api";

export const favoritesKeys = {
  all: ["favorites"] as const,
  lists: () => [...favoritesKeys.all, "list"] as const,
  list: () => [...favoritesKeys.lists()] as const,
};

export function useFavorites() {
  return useQuery({
    queryKey: favoritesKeys.list(),
    queryFn: favoritesApi.getAll,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useCSRFToken() {
  return useQuery({
    queryKey: ["csrf-token"],
    queryFn: favoritesApi.getCSRFToken,
    staleTime: 50 * 60 * 1000, // 50 minutes (tokens expire in 1 hour)
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  const { data: csrfToken, refetch: refetchCSRFToken } = useCSRFToken();

  return useMutation({
    mutationFn: async (data: CreateFavoriteInput) => {
      let token = csrfToken;
      if (!token) {
        const result = await refetchCSRFToken();
        token = result.data;
      }
      if (!token) {
        throw new Error("CSRF token not available");
      }
      return favoritesApi.create(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favoritesKeys.list() });
    },
  });
}

export function useUpdateFavorite() {
  const queryClient = useQueryClient();
  const { data: csrfToken, refetch: refetchCSRFToken } = useCSRFToken();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateFavoriteInput }) => {
      let token = csrfToken;
      if (!token) {
        const result = await refetchCSRFToken();
        token = result.data;
      }
      if (!token) {
        throw new Error("CSRF token not available");
      }
      return favoritesApi.update(id, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favoritesKeys.list() });
    },
  });
}

export function useDeleteFavorite() {
  const queryClient = useQueryClient();
  const { data: csrfToken, refetch: refetchCSRFToken } = useCSRFToken();

  return useMutation({
    mutationFn: async (id: number) => {
      let token = csrfToken;
      if (!token) {
        const result = await refetchCSRFToken();
        token = result.data;
      }
      if (!token) {
        throw new Error("CSRF token not available");
      }
      return favoritesApi.delete(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favoritesKeys.list() });
    },
  });
}

