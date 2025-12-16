import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
} from "../api/playlists";
import type { CreatePlaylistInput, UpdatePlaylistInput } from "../api/types";

export const playlistKeys = {
  all: ["playlists"] as const,
  lists: () => [...playlistKeys.all, "list"] as const,
  details: () => [...playlistKeys.all, "detail"] as const,
  detail: (id: number) => [...playlistKeys.details(), id] as const,
};

export function usePlaylists() {
  return useQuery({
    queryKey: playlistKeys.lists(),
    queryFn: getPlaylists,
    staleTime: 1000 * 60,
  });
}

export function usePlaylist(id: number) {
  return useQuery({
    queryKey: playlistKeys.detail(id),
    queryFn: () => getPlaylistById(id),
    staleTime: 1000 * 60,
    enabled: id > 0,
  });
}

export function useCreatePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlaylistInput) => createPlaylist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.lists() });
    },
  });
}

export function useUpdatePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePlaylistInput }) =>
      updatePlaylist(id, data),
    onSuccess: (playlist) => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.detail(playlist.id) });
      queryClient.invalidateQueries({ queryKey: playlistKeys.lists() });
    },
  });
}

export function useDeletePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.lists() });
    },
  });
}

export function useAddVideoToPlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, videoId }: { playlistId: number; videoId: number }) =>
      addVideoToPlaylist(playlistId, videoId),
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.detail(playlistId) });
      queryClient.invalidateQueries({ queryKey: playlistKeys.lists() });
    },
  });
}

export function useRemoveVideoFromPlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, videoId }: { playlistId: number; videoId: number }) =>
      removeVideoFromPlaylist(playlistId, videoId),
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.detail(playlistId) });
      queryClient.invalidateQueries({ queryKey: playlistKeys.lists() });
    },
  });
}
