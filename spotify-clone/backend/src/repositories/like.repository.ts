import { db } from "../db/database.js";
import type { Song, SongWithLiked } from "../types/index.js";

export const likeRepository = {
  findLikedSongsByUserId(userId: number): SongWithLiked[] {
    const stmt = db.prepare(`
      SELECT s.*, 1 as is_liked
      FROM liked_songs ls
      JOIN songs s ON ls.song_id = s.id
      WHERE ls.user_id = ?
      ORDER BY ls.liked_at DESC
    `);
    return (stmt.all(userId) as (Song & { is_liked: number })[]).map((s) => ({
      ...s,
      is_liked: true,
    }));
  },

  isLiked(userId: number, songId: number): boolean {
    const stmt = db.prepare("SELECT 1 FROM liked_songs WHERE user_id = ? AND song_id = ?");
    return !!stmt.get(userId, songId);
  },

  like(userId: number, songId: number): boolean {
    try {
      const stmt = db.prepare(`
        INSERT INTO liked_songs (user_id, song_id)
        VALUES (?, ?)
      `);
      stmt.run(userId, songId);
      return true;
    } catch {
      return false; // Already liked (unique constraint)
    }
  },

  unlike(userId: number, songId: number): boolean {
    const stmt = db.prepare("DELETE FROM liked_songs WHERE user_id = ? AND song_id = ?");
    const result = stmt.run(userId, songId);
    return result.changes > 0;
  },

  toggleLike(userId: number, songId: number): boolean {
    if (this.isLiked(userId, songId)) {
      this.unlike(userId, songId);
      return false; // Now unliked
    } else {
      this.like(userId, songId);
      return true; // Now liked
    }
  },
};
