import { db } from "../db/database.js";
import type { Rating } from "../types/index.js";

export const ratingRepository = {
  findByUserAndTitle(userId: number, titleId: number): Rating | undefined {
    const stmt = db.prepare("SELECT * FROM ratings WHERE user_id = ? AND title_id = ?");
    return stmt.get(userId, titleId) as Rating | undefined;
  },

  getAverageRating(titleId: number): number | null {
    const stmt = db.prepare("SELECT ROUND(AVG(rating), 1) as avg FROM ratings WHERE title_id = ?");
    const result = stmt.get(titleId) as { avg: number | null };
    return result.avg;
  },

  rate(userId: number, titleId: number, rating: number): Rating {
    // Upsert rating
    const existingRating = this.findByUserAndTitle(userId, titleId);

    if (existingRating) {
      const stmt = db.prepare("UPDATE ratings SET rating = ?, rated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND title_id = ?");
      stmt.run(rating, userId, titleId);
    } else {
      const stmt = db.prepare("INSERT INTO ratings (user_id, title_id, rating) VALUES (?, ?, ?)");
      stmt.run(userId, titleId, rating);
    }

    return this.findByUserAndTitle(userId, titleId)!;
  },

  remove(userId: number, titleId: number): boolean {
    const stmt = db.prepare("DELETE FROM ratings WHERE user_id = ? AND title_id = ?");
    const result = stmt.run(userId, titleId);
    return result.changes > 0;
  },
};
