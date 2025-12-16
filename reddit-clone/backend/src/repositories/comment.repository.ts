import db from "../db/database.js";
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

  findByUser(userId: number): CommentWithAuthor[] {
    return db
      .prepare(
        `
      SELECT 
        c.*,
        u.name as author_name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `
      )
      .all(userId) as CommentWithAuthor[];
  }

  create(userId: number, postId: number, data: CreateCommentDto): number {
    const result = db
      .prepare(
        "INSERT INTO comments (post_id, user_id, parent_id, content) VALUES (?, ?, ?, ?)"
      )
      .run(postId, userId, data.parent_id || null, data.content);
    return result.lastInsertRowid as number;
  }

  update(id: number, data: UpdateCommentDto): boolean {
    const updates: string[] = [];
    const params: unknown[] = [];

    if (data.content !== undefined) {
      updates.push("content = ?");
      params.push(data.content);
    }

    if (updates.length === 0) {
      return false;
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    params.push(id);
    const result = db
      .prepare(`UPDATE comments SET ${updates.join(", ")} WHERE id = ?`)
      .run(...params);
    return result.changes > 0;
  }

  delete(id: number): boolean {
    const result = db.prepare("DELETE FROM comments WHERE id = ?").run(id);
    return result.changes > 0;
  }

  incrementUpvotes(id: number): boolean {
    const result = db.prepare("UPDATE comments SET upvotes = upvotes + 1 WHERE id = ?").run(id);
    return result.changes > 0;
  }

  decrementUpvotes(id: number): boolean {
    const result = db.prepare("UPDATE comments SET upvotes = upvotes - 1 WHERE id = ?").run(id);
    return result.changes > 0;
  }
}

export const commentRepository = new CommentRepository();

