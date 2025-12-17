import { songRepository } from "../repositories/index.js";
import type { SongWithLiked } from "../types/index.js";

export class SongService {
  getAllSongs(userId: number | null): SongWithLiked[] {
    return songRepository.findAllWithLikedStatus(userId);
  }

  searchSongs(query: string, userId: number | null): SongWithLiked[] {
    return songRepository.search(query, userId);
  }

  getSongById(id: number): SongWithLiked | undefined {
    const song = songRepository.findById(id);
    if (!song) return undefined;
    return { ...song, is_liked: false };
  }
}

export const songService = new SongService();
