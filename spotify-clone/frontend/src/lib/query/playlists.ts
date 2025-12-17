import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { playlistsApi, type CreatePlaylistInput } from "../api";
import { songKeys } from "./songs";

export const playlistKeys = {
  all: ["playlists"] as const,
  list: () => [...playlistKeys.all, "list"] as const,
  detail: (id: number) => [...playlistKeys.all, "detail", id] as const,
};

export function usePlaylists(enabled = true) {
  return useQuery({
    queryKey: playlistKeys.list(),
    queryFn: playlistsApi.getAll,
    staleTime: 60 * 1000, // 1 minute
    enabled,
  });
}

export function usePlaylist(id: number) {
  return useQuery({
    queryKey: playlistKeys.detail(id),
    queryFn: () => playlistsApi.getById(id),
    enabled: id > 0,
    staleTime: 60 * 1000,
  });
}

export function useCreatePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlaylistInput) => playlistsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.list() });
    },
  });
}

export function useUpdatePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreatePlaylistInput> }) =>
      playlistsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.list() });
      queryClient.invalidateQueries({ queryKey: playlistKeys.detail(id) });
    },
  });
}

export function useDeletePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => playlistsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.list() });
    },
  });
}

export function useAddSongToPlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, songId }: { playlistId: number; songId: number }) =>
      playlistsApi.addSong(playlistId, songId),
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.detail(playlistId) });
    },
  });
}

export function useRemoveSongFromPlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, songId }: { playlistId: number; songId: number }) =>
      playlistsApi.removeSong(playlistId, songId),
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.detail(playlistId) });
      queryClient.invalidateQueries({ queryKey: songKeys.list() });
    },
  });
}
