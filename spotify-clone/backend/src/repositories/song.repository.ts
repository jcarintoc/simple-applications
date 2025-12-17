import { db } from "../db/database.js";
import type { Song, SongWithLiked } from "../types/index.js";

export const songRepository = {
  findAll(): Song[] {
    const stmt = db.prepare("SELECT * FROM songs ORDER BY title ASC");
    return stmt.all() as Song[];
  },

  findById(id: number): Song | undefined {
    const stmt = db.prepare("SELECT * FROM songs WHERE id = ?");
    return stmt.get(id) as Song | undefined;
  },

  findAllWithLikedStatus(userId: number | null): SongWithLiked[] {
    if (userId) {
      const stmt = db.prepare(`
        SELECT s.*,
          CASE WHEN ls.id IS NOT NULL THEN 1 ELSE 0 END as is_liked
        FROM songs s
        LEFT JOIN liked_songs ls ON s.id = ls.song_id AND ls.user_id = ?
        ORDER BY s.title ASC
      `);
      return (stmt.all(userId) as (Song & { is_liked: number })[]).map((s) => ({
        ...s,
        is_liked: Boolean(s.is_liked),
      }));
    }

    const stmt = db.prepare("SELECT *, 0 as is_liked FROM songs ORDER BY title ASC");
    return (stmt.all() as (Song & { is_liked: number })[]).map((s) => ({
      ...s,
      is_liked: false,
    }));
  },

  search(query: string, userId: number | null): SongWithLiked[] {
    const searchTerm = `%${query}%`;
    if (userId) {
      const stmt = db.prepare(`
        SELECT s.*,
          CASE WHEN ls.id IS NOT NULL THEN 1 ELSE 0 END as is_liked
        FROM songs s
        LEFT JOIN liked_songs ls ON s.id = ls.song_id AND ls.user_id = ?
        WHERE s.title LIKE ? OR s.artist LIKE ? OR s.album LIKE ?
        ORDER BY s.title ASC
      `);
      return (stmt.all(userId, searchTerm, searchTerm, searchTerm) as (Song & { is_liked: number })[]).map((s) => ({
        ...s,
        is_liked: Boolean(s.is_liked),
      }));
    }

    const stmt = db.prepare(`
      SELECT *, 0 as is_liked FROM songs
      WHERE title LIKE ? OR artist LIKE ? OR album LIKE ?
      ORDER BY title ASC
    `);
    return (stmt.all(searchTerm, searchTerm, searchTerm) as (Song & { is_liked: number })[]).map((s) => ({
      ...s,
      is_liked: false,
    }));
  },
};
