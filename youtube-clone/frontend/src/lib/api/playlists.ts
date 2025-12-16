import { apiClient } from "./client";
import type { Playlist, CreatePlaylistInput, UpdatePlaylistInput, Video } from "./types";

export async function getPlaylists(): Promise<Playlist[]> {
  const response = await apiClient.get<Playlist[]>("/playlists");
  return response.data;
}

export async function getPlaylistById(id: number): Promise<Playlist & { videos: Video[] }> {
  const response = await apiClient.get<Playlist & { videos: Video[] }>(`/playlists/${id}`);
  return response.data;
}

export async function createPlaylist(data: CreatePlaylistInput): Promise<Playlist> {
  const response = await apiClient.post<Playlist>("/playlists", data);
  return response.data;
}

export async function updatePlaylist(id: number, data: UpdatePlaylistInput): Promise<Playlist> {
  const response = await apiClient.put<Playlist>(`/playlists/${id}`, data);
  return response.data;
}

export async function deletePlaylist(id: number): Promise<void> {
  await apiClient.delete(`/playlists/${id}`);
}

export async function addVideoToPlaylist(playlistId: number, videoId: number): Promise<void> {
  await apiClient.post(`/playlists/${playlistId}/videos`, { video_id: videoId });
}

export async function removeVideoFromPlaylist(playlistId: number, videoId: number): Promise<void> {
  await apiClient.delete(`/playlists/${playlistId}/videos/${videoId}`);
}
