import db from "../db/database.js";
import type { Vote } from "../types/index.js";

export class VoteRepository {
  findByUserAndPost(userId: number, postId: number): Vote | undefined {
    return db
      .prepare("SELECT * FROM votes WHERE user_id = ? AND post_id = ?")
      .get(userId, postId) as Vote | undefined;
  }

  findByUserAndComment(userId: number, commentId: number): Vote | undefined {
    return db
      .prepare("SELECT * FROM votes WHERE user_id = ? AND comment_id = ?")
      .get(userId, commentId) as Vote | undefined;
  }

  create(userId: number, postId?: number | null, commentId?: number | null): number {
    const result = db
      .prepare("INSERT INTO votes (user_id, post_id, comment_id) VALUES (?, ?, ?)")
      .run(userId, postId || null, commentId || null);
    return result.lastInsertRowid as number;
  }

  deleteByUserAndPost(userId: number, postId: number): boolean {
    const result = db
      .prepare("DELETE FROM votes WHERE user_id = ? AND post_id = ?")
      .run(userId, postId);
    return result.changes > 0;
  }

  deleteByUserAndComment(userId: number, commentId: number): boolean {
    const result = db
      .prepare("DELETE FROM votes WHERE user_id = ? AND comment_id = ?")
      .run(userId, commentId);
    return result.changes > 0;
  }
}

export const voteRepository = new VoteRepository();

