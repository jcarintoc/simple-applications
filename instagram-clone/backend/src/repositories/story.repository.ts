import { db } from "../db/database.js";
import type { Story, StoryWithAuthor } from "../types/index.js";

export class StoryRepository {
  findActive(): StoryWithAuthor[] {
    return db
      .prepare(
        `
      SELECT 
        s.*,
        u.name as author_name
      FROM stories s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.created_at DESC
    `
      )
      .all() as StoryWithAuthor[];
  }

  findByUser(userId: number): StoryWithAuthor[] {
    return db
      .prepare(
        `
      SELECT 
        s.*,
        u.name as author_name
      FROM stories s
      JOIN users u ON s.user_id = u.id
      WHERE s.user_id = ?
      ORDER BY s.created_at DESC
    `
      )
      .all(userId) as StoryWithAuthor[];
  }

  deleteExpired(): number {
    const result = db.prepare("DELETE FROM stories WHERE expires_at <= datetime('now')").run();
    return result.changes;
  }
}

export const storyRepository = new StoryRepository();
