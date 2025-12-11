import db from "../db/database.js";

export interface Comment {
  id: number;
  user_id: number;
  post_id: number;
  content: string;
  created_at: string;
}

export interface CommentWithUser extends Comment {
  user_name: string;
  user_email: string;
  user_username: string;
}

export class CommentRepository {
  create(userId: number, postId: number, content: string): number {
    const result = db
      .prepare("INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)")
      .run(userId, postId, content);
    return result.lastInsertRowid as number;
  }

  findById(commentId: number): CommentWithUser | undefined {
    return db
      .prepare(`
        SELECT
          c.*,
          u.name as user_name,
          u.email as user_email,
          u.username as user_username
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.id = ?
      `)
      .get(commentId) as CommentWithUser | undefined;
  }

  findByPostId(postId: number, limit: number = 50, offset: number = 0): CommentWithUser[] {
    return db
      .prepare(`
        SELECT
          c.*,
          u.name as user_name,
          u.email as user_email,
          u.username as user_username
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.post_id = ?
        ORDER BY c.created_at DESC
        LIMIT ? OFFSET ?
      `)
      .all(postId, limit, offset) as CommentWithUser[];
  }

  delete(commentId: number, userId: number): boolean {
    const result = db
      .prepare("DELETE FROM comments WHERE id = ? AND user_id = ?")
      .run(commentId, userId);
    return result.changes > 0;
  }

  countByPostId(postId: number): number {
    const result = db
      .prepare("SELECT COUNT(*) as count FROM comments WHERE post_id = ?")
      .get(postId) as { count: number };
    return result.count;
  }
}

export const commentRepository = new CommentRepository();
