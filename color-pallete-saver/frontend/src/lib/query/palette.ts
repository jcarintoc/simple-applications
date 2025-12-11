import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paletteApi, type CreatePaletteInput, type UpdatePaletteInput } from "../api";

export const paletteKeys = {
  all: ["palettes"] as const,
  lists: () => [...paletteKeys.all, "list"] as const,
  detail: (id: number) => [...paletteKeys.all, "detail", id] as const,
  csrf: () => [...paletteKeys.all, "csrf"] as const,
};

export function usePalettes() {
  return useQuery({
    queryKey: paletteKeys.lists(),
    queryFn: paletteApi.getAll,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function usePalette(id: number) {
  return useQuery({
    queryKey: paletteKeys.detail(id),
    queryFn: () => paletteApi.getById(id),
    enabled: !!id,
  });
}

export function useCreatePalette() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaletteInput) => paletteApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paletteKeys.lists() });
    },
  });
}

export function useUpdatePalette() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePaletteInput }) =>
      paletteApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: paletteKeys.lists() });
      queryClient.invalidateQueries({ queryKey: paletteKeys.detail(id) });
    },
  });
}

export function useDeletePalette() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // Get fresh CSRF token before delete
      const { csrfToken } = await paletteApi.getCsrfToken();
      return paletteApi.delete(id, csrfToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paletteKeys.lists() });
    },
  });
}

