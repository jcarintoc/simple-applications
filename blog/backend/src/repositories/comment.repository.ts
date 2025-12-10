import { db } from "../db/database.js";
import { Comment, CommentWithAuthor, CreateCommentDto } from "../types/index.js";

export const createComment = (postId: number, data: CreateCommentDto, authorId: number): Comment => {
  const timestamp = new Date().toISOString();

  const result = db
    .prepare(`INSERT INTO comments (post_id, author_id, content) VALUES (?, ?, ?)`)
    .run(postId, authorId, data.content);

  return {
    id: result.lastInsertRowid as number,
    post_id: postId,
    author_id: authorId,
    content: data.content,
    created_at: timestamp,
  };
};

export const findCommentsByPostId = (postId: number): CommentWithAuthor[] => {
  return db
    .prepare<[number]>(
      `SELECT c.*, u.name as author_name, u.email as author_email
       FROM comments c
       JOIN users u ON c.author_id = u.id
       WHERE c.post_id = ?
       ORDER BY c.created_at ASC`
    )
    .all(postId) as CommentWithAuthor[];
};

export const deleteComment = (id: number): boolean => {
  const result = db.prepare("DELETE FROM comments WHERE id = ?").run(id);
  return result.changes > 0;
};

export const findCommentById = (id: number): Comment | undefined => {
  return db.prepare<[number]>("SELECT * FROM comments WHERE id = ?").get(id) as Comment | undefined;
};
