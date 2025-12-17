import { db } from "../db/database.js";
import type { Title, TitleWithUserData, TitleType } from "../types/index.js";

export const titleRepository = {
  findAll(): Title[] {
    const stmt = db.prepare("SELECT * FROM titles ORDER BY release_year DESC");
    return stmt.all() as Title[];
  },

  findById(id: number): Title | undefined {
    const stmt = db.prepare("SELECT * FROM titles WHERE id = ?");
    return stmt.get(id) as Title | undefined;
  },

  findByType(type: TitleType): Title[] {
    const stmt = db.prepare("SELECT * FROM titles WHERE type = ? ORDER BY release_year DESC");
    return stmt.all(type) as Title[];
  },

  findByGenre(genre: string): Title[] {
    const stmt = db.prepare("SELECT * FROM titles WHERE genre = ? ORDER BY release_year DESC");
    return stmt.all(genre) as Title[];
  },

  search(query: string): Title[] {
    const searchTerm = `%${query}%`;
    const stmt = db.prepare(`
      SELECT * FROM titles
      WHERE title LIKE ? OR description LIKE ? OR genre LIKE ?
      ORDER BY release_year DESC
    `);
    return stmt.all(searchTerm, searchTerm, searchTerm) as Title[];
  },

  findAllWithUserData(userId: number | null): TitleWithUserData[] {
    if (userId) {
      const stmt = db.prepare(`
        SELECT t.*,
          CASE WHEN w.id IS NOT NULL THEN 1 ELSE 0 END as in_watchlist,
          r.rating as user_rating,
          (SELECT ROUND(AVG(rating), 1) FROM ratings WHERE title_id = t.id) as avg_rating
        FROM titles t
        LEFT JOIN watchlist w ON t.id = w.title_id AND w.user_id = ?
        LEFT JOIN ratings r ON t.id = r.title_id AND r.user_id = ?
        ORDER BY t.release_year DESC
      `);
      return (stmt.all(userId, userId) as (Title & { in_watchlist: number; user_rating: number | null; avg_rating: number | null })[]).map((t) => ({
        ...t,
        in_watchlist: Boolean(t.in_watchlist),
      }));
    }

    const stmt = db.prepare(`
      SELECT t.*, 0 as in_watchlist, NULL as user_rating,
        (SELECT ROUND(AVG(rating), 1) FROM ratings WHERE title_id = t.id) as avg_rating
      FROM titles t
      ORDER BY t.release_year DESC
    `);
    return (stmt.all() as (Title & { in_watchlist: number; user_rating: number | null; avg_rating: number | null })[]).map((t) => ({
      ...t,
      in_watchlist: false,
    }));
  },

  getGenres(): string[] {
    const stmt = db.prepare("SELECT DISTINCT genre FROM titles ORDER BY genre");
    return (stmt.all() as { genre: string }[]).map((r) => r.genre);
  },
};
