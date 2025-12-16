import { playlistRepository } from "../repositories/playlist.repository.js";
import { videoRepository } from "../repositories/video.repository.js";
import type { PlaylistWithDetails, Video } from "../types/index.js";

interface PlaylistWithVideos extends PlaylistWithDetails {
  videos: (Video & { position: number })[];
}

export const playlistService = {
  getPlaylistsByUser(userId: number): PlaylistWithDetails[] {
    return playlistRepository.findByUserId(userId);
  },

  getPlaylistById(id: number, requestingUserId?: number): PlaylistWithVideos {
    const playlist = playlistRepository.findByIdWithDetails(id);

    if (!playlist) {
      throw new Error("Playlist not found");
    }

    // Check if playlist is accessible
    if (!playlist.is_public && playlist.user_id !== requestingUserId) {
      throw new Error("Playlist not found");
    }

    const videos = playlistRepository.getVideos(id);

    return {
      ...playlist,
      videos,
    };
  },

  createPlaylist(userId: number, name: string, description?: string, isPublic = true): PlaylistWithDetails {
    const id = playlistRepository.create(userId, name, description || null, isPublic);
    const playlist = playlistRepository.findByIdWithDetails(id);

    if (!playlist) {
      throw new Error("Failed to create playlist");
    }

    return playlist;
  },

  updatePlaylist(id: number, userId: number, name?: string, description?: string, isPublic?: boolean): PlaylistWithDetails {
    const owner = playlistRepository.getOwner(id);

    if (!owner) {
      throw new Error("Playlist not found");
    }

    if (owner !== userId) {
      throw new Error("Not authorized to update this playlist");
    }

    playlistRepository.update(id, name, description, isPublic);
    const playlist = playlistRepository.findByIdWithDetails(id);

    if (!playlist) {
      throw new Error("Failed to update playlist");
    }

    return playlist;
  },

  deletePlaylist(id: number, userId: number): void {
    const owner = playlistRepository.getOwner(id);

    if (!owner) {
      throw new Error("Playlist not found");
    }

    if (owner !== userId) {
      throw new Error("Not authorized to delete this playlist");
    }

    playlistRepository.delete(id);
  },

  addVideoToPlaylist(playlistId: number, videoId: number, userId: number): void {
    const owner = playlistRepository.getOwner(playlistId);

    if (!owner) {
      throw new Error("Playlist not found");
    }

    if (owner !== userId) {
      throw new Error("Not authorized to modify this playlist");
    }

    const video = videoRepository.findById(videoId);
    if (!video) {
      throw new Error("Video not found");
    }

    if (playlistRepository.hasVideo(playlistId, videoId)) {
      throw new Error("Video already in playlist");
    }

    playlistRepository.addVideo(playlistId, videoId);
  },

  removeVideoFromPlaylist(playlistId: number, videoId: number, userId: number): void {
    const owner = playlistRepository.getOwner(playlistId);

    if (!owner) {
      throw new Error("Playlist not found");
    }

    if (owner !== userId) {
      throw new Error("Not authorized to modify this playlist");
    }

    if (!playlistRepository.hasVideo(playlistId, videoId)) {
      throw new Error("Video not in playlist");
    }

    playlistRepository.removeVideo(playlistId, videoId);
  },
};
