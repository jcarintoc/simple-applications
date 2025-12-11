import db from "../db/database.js";

export interface Like {
  id: number;
  user_id: number;
  post_id: number;
  created_at: string;
}

export class LikeRepository {
  create(userId: number, postId: number): boolean {
    try {
      db.prepare("INSERT INTO likes (user_id, post_id) VALUES (?, ?)").run(userId, postId);
      return true;
    } catch {
      // Already liked (UNIQUE constraint violation)
      return false;
    }
  }

  delete(userId: number, postId: number): boolean {
    const result = db
      .prepare("DELETE FROM likes WHERE user_id = ? AND post_id = ?")
      .run(userId, postId);
    return result.changes > 0;
  }

  exists(userId: number, postId: number): boolean {
    const like = db
      .prepare("SELECT id FROM likes WHERE user_id = ? AND post_id = ?")
      .get(userId, postId);
    return !!like;
  }

  countByPostId(postId: number): number {
    const result = db
      .prepare("SELECT COUNT(*) as count FROM likes WHERE post_id = ?")
      .get(postId) as { count: number };
    return result.count;
  }

  findByPostId(postId: number, limit: number = 50, offset: number = 0): Array<{ id: number; name: string; email: string; username: string }> {
    return db
      .prepare(`
        SELECT u.id, u.name, u.email, u.username
        FROM likes l
        JOIN users u ON l.user_id = u.id
        WHERE l.post_id = ?
        ORDER BY l.created_at DESC
        LIMIT ? OFFSET ?
      `)
      .all(postId, limit, offset) as Array<{ id: number; name: string; email: string; username: string }>;
  }
}

export const likeRepository = new LikeRepository();
