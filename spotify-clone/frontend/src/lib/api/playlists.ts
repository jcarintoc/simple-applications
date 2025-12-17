import { apiClient } from "./client";
import {
  type PlaylistsResponse,
  type PlaylistResponse,
  type CreatePlaylistInput,
  type Playlist,
  playlistsResponseSchema,
  playlistResponseSchema,
  playlistSchema,
} from "./types";

function getCsrfToken(): string {
  const match = document.cookie.match(/csrf_token=([^;]+)/);
  return match ? match[1] : "";
}

export const playlistsApi = {
  getAll: async (): Promise<PlaylistsResponse> => {
    const response = await apiClient.get<PlaylistsResponse>("/playlists");
    return playlistsResponseSchema.parse(response.data);
  },

  getById: async (id: number): Promise<PlaylistResponse> => {
    const response = await apiClient.get<PlaylistResponse>(`/playlists/${id}`);
    return playlistResponseSchema.parse(response.data);
  },

  create: async (data: CreatePlaylistInput): Promise<Playlist> => {
    const response = await apiClient.post<{ message: string; playlist: Playlist }>(
      "/playlists",
      data,
      {
        headers: { "x-csrf-token": getCsrfToken() },
      }
    );
    return playlistSchema.parse(response.data.playlist);
  },

  update: async (id: number, data: Partial<CreatePlaylistInput>): Promise<Playlist> => {
    const response = await apiClient.put<{ message: string; playlist: Playlist }>(
      `/playlists/${id}`,
      data,
      {
        headers: { "x-csrf-token": getCsrfToken() },
      }
    );
    return playlistSchema.parse(response.data.playlist);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/playlists/${id}`, {
      headers: { "x-csrf-token": getCsrfToken() },
    });
  },

  addSong: async (playlistId: number, songId: number): Promise<void> => {
    await apiClient.post(
      `/playlists/${playlistId}/songs/${songId}`,
      {},
      {
        headers: { "x-csrf-token": getCsrfToken() },
      }
    );
  },

  removeSong: async (playlistId: number, songId: number): Promise<void> => {
    await apiClient.delete(`/playlists/${playlistId}/songs/${songId}`, {
      headers: { "x-csrf-token": getCsrfToken() },
    });
  },
};
