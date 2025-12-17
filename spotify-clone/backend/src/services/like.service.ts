import { likeRepository, songRepository } from "../repositories/index.js";
import type { SongWithLiked } from "../types/index.js";

export class LikeService {
  getLikedSongs(userId: number): SongWithLiked[] {
    return likeRepository.findLikedSongsByUserId(userId);
  }

  toggleLike(userId: number, songId: number): { success: boolean; is_liked: boolean; error?: string } {
    const song = songRepository.findById(songId);
    if (!song) {
      return { success: false, is_liked: false, error: "Song not found" };
    }

    const isLiked = likeRepository.toggleLike(userId, songId);
    return { success: true, is_liked: isLiked };
  }

  likeSong(userId: number, songId: number): { success: boolean; error?: string } {
    const song = songRepository.findById(songId);
    if (!song) {
      return { success: false, error: "Song not found" };
    }

    if (likeRepository.isLiked(userId, songId)) {
      return { success: false, error: "Song already liked" };
    }

    likeRepository.like(userId, songId);
    return { success: true };
  }

  unlikeSong(userId: number, songId: number): { success: boolean; error?: string } {
    const song = songRepository.findById(songId);
    if (!song) {
      return { success: false, error: "Song not found" };
    }

    if (!likeRepository.isLiked(userId, songId)) {
      return { success: false, error: "Song not liked" };
    }

    likeRepository.unlike(userId, songId);
    return { success: true };
  }
}

export const likeService = new LikeService();
