import { db } from "../db/database.js";
import type { WatchlistItem, TitleWithUserData, Title } from "../types/index.js";

export const watchlistRepository = {
  findByUserId(userId: number): TitleWithUserData[] {
    const stmt = db.prepare(`
      SELECT t.*,
        1 as in_watchlist,
        r.rating as user_rating,
        (SELECT ROUND(AVG(rating), 1) FROM ratings WHERE title_id = t.id) as avg_rating
      FROM watchlist w
      JOIN titles t ON w.title_id = t.id
      LEFT JOIN ratings r ON t.id = r.title_id AND r.user_id = ?
      WHERE w.user_id = ?
      ORDER BY w.added_at DESC
    `);
    return (stmt.all(userId, userId) as (Title & { in_watchlist: number; user_rating: number | null; avg_rating: number | null })[]).map((t) => ({
      ...t,
      in_watchlist: true,
    }));
  },

  isInWatchlist(userId: number, titleId: number): boolean {
    const stmt = db.prepare("SELECT 1 FROM watchlist WHERE user_id = ? AND title_id = ?");
    return !!stmt.get(userId, titleId);
  },

  add(userId: number, titleId: number): boolean {
    try {
      const stmt = db.prepare("INSERT INTO watchlist (user_id, title_id) VALUES (?, ?)");
      stmt.run(userId, titleId);
      return true;
    } catch {
      return false; // Already in watchlist
    }
  },

  remove(userId: number, titleId: number): boolean {
    const stmt = db.prepare("DELETE FROM watchlist WHERE user_id = ? AND title_id = ?");
    const result = stmt.run(userId, titleId);
    return result.changes > 0;
  },

  toggle(userId: number, titleId: number): boolean {
    if (this.isInWatchlist(userId, titleId)) {
      this.remove(userId, titleId);
      return false; // Now removed
    } else {
      this.add(userId, titleId);
      return true; // Now added
    }
  },
};
