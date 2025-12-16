import { db } from "../db/database.js";
import type {
  Comment,
  CommentWithAuthor,
  CreateCommentDto,
  UpdateCommentDto,
} from "../types/index.js";

export class CommentRepository {
  findByPost(postId: number): CommentWithAuthor[] {
    return db
      .prepare(
        `
      SELECT 
        c.*,
        u.name as author_name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at DESC
    `
      )
      .all(postId) as CommentWithAuthor[];
  }

  findById(id: number): CommentWithAuthor | undefined {
    return db
      .prepare(
        `
      SELECT 
        c.*,
        u.name as author_name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `
      )
      .get(id) as CommentWithAuthor | undefined;
  }

  create(userId: number, postId: number, data: CreateCommentDto): Comment {
    const result = db
      .prepare("INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)")
      .run(userId, postId, data.content);
    return db.prepare("SELECT * FROM comments WHERE id = ?").get(result.lastInsertRowid) as Comment;
  }

  update(id: number, data: UpdateCommentDto): Comment | undefined {
    const updates: string[] = [];
    const values: unknown[] = [];

    if (data.content !== undefined) {
      updates.push("content = ?");
      values.push(data.content);
    }

    if (updates.length === 0) {
      return this.findById(id) as Comment | undefined;
    }

    values.push(id);

    db.prepare(`UPDATE comments SET ${updates.join(", ")} WHERE id = ?`).run(...values);
    return db.prepare("SELECT * FROM comments WHERE id = ?").get(id) as Comment | undefined;
  }

  delete(id: number): boolean {
    const result = db.prepare("DELETE FROM comments WHERE id = ?").run(id);
    return result.changes > 0;
  }
}

export const commentRepository = new CommentRepository();
