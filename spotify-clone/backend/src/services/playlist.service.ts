import { playlistRepository, songRepository } from "../repositories/index.js";
import type { Playlist, PlaylistWithSongs, CreatePlaylistDto, UpdatePlaylistDto } from "../types/index.js";

export class PlaylistService {
  getUserPlaylists(userId: number): Playlist[] {
    return playlistRepository.findAllByUserId(userId);
  }

  getPlaylistById(id: number, userId: number): PlaylistWithSongs | undefined {
    return playlistRepository.findByIdWithSongs(id, userId);
  }

  createPlaylist(userId: number, data: CreatePlaylistDto): Playlist {
    return playlistRepository.create(userId, data);
  }

  updatePlaylist(id: number, userId: number, data: UpdatePlaylistDto): Playlist | undefined {
    const playlist = playlistRepository.findById(id);
    if (!playlist || playlist.user_id !== userId) {
      return undefined;
    }
    return playlistRepository.update(id, data);
  }

  deletePlaylist(id: number, userId: number): boolean {
    const playlist = playlistRepository.findById(id);
    if (!playlist || playlist.user_id !== userId) {
      return false;
    }
    return playlistRepository.delete(id);
  }

  addSongToPlaylist(playlistId: number, songId: number, userId: number): { success: boolean; error?: string } {
    const playlist = playlistRepository.findById(playlistId);
    if (!playlist) {
      return { success: false, error: "Playlist not found" };
    }
    if (playlist.user_id !== userId) {
      return { success: false, error: "Not authorized" };
    }

    const song = songRepository.findById(songId);
    if (!song) {
      return { success: false, error: "Song not found" };
    }

    if (playlistRepository.hasSong(playlistId, songId)) {
      return { success: false, error: "Song already in playlist" };
    }

    playlistRepository.addSong(playlistId, songId);
    return { success: true };
  }

  removeSongFromPlaylist(playlistId: number, songId: number, userId: number): { success: boolean; error?: string } {
    const playlist = playlistRepository.findById(playlistId);
    if (!playlist) {
      return { success: false, error: "Playlist not found" };
    }
    if (playlist.user_id !== userId) {
      return { success: false, error: "Not authorized" };
    }

    if (!playlistRepository.hasSong(playlistId, songId)) {
      return { success: false, error: "Song not in playlist" };
    }

    playlistRepository.removeSong(playlistId, songId);
    return { success: true };
  }
}

export const playlistService = new PlaylistService();
