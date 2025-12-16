import { db } from "../db/database.js";
import type { Like } from "../types/index.js";

export class LikeRepository {
  findByUserAndPost(userId: number, postId: number): Like | undefined {
    return db
      .prepare("SELECT * FROM likes WHERE user_id = ? AND post_id = ?")
      .get(userId, postId) as Like | undefined;
  }

  create(userId: number, postId: number): Like {
    const result = db
      .prepare("INSERT INTO likes (user_id, post_id) VALUES (?, ?)")
      .run(userId, postId);
    return db.prepare("SELECT * FROM likes WHERE id = ?").get(result.lastInsertRowid) as Like;
  }

  deleteByUserAndPost(userId: number, postId: number): boolean {
    const result = db.prepare("DELETE FROM likes WHERE user_id = ? AND post_id = ?").run(userId, postId);
    return result.changes > 0;
  }
}

export const likeRepository = new LikeRepository();
