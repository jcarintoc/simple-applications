import db from "../db/database.js";
import type { Comment, CommentWithUser } from "../types/index.js";

export const commentRepository = {
  findByVideoId(videoId: number): CommentWithUser[] {
    const query = `
      SELECT
        c.*,
        u.name as user_name,
        u.email as user_email
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.video_id = ?
      ORDER BY c.created_at DESC
    `;
    return db.prepare(query).all(videoId) as CommentWithUser[];
  },

  findById(id: number): Comment | undefined {
    return db.prepare("SELECT * FROM comments WHERE id = ?").get(id) as Comment | undefined;
  },

  create(userId: number, videoId: number, content: string): number {
    const stmt = db.prepare(
      "INSERT INTO comments (user_id, video_id, content) VALUES (?, ?, ?)"
    );
    const result = stmt.run(userId, videoId, content);
    return result.lastInsertRowid as number;
  },

  update(id: number, content: string): boolean {
    const stmt = db.prepare("UPDATE comments SET content = ? WHERE id = ?");
    const result = stmt.run(content, id);
    return result.changes > 0;
  },

  delete(id: number): boolean {
    const stmt = db.prepare("DELETE FROM comments WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  },

  getOwner(id: number): number | undefined {
    const comment = db.prepare("SELECT user_id FROM comments WHERE id = ?").get(id) as { user_id: number } | undefined;
    return comment?.user_id;
  },

  countByVideo(videoId: number): number {
    const result = db.prepare(
      "SELECT COUNT(*) as count FROM comments WHERE video_id = ?"
    ).get(videoId) as { count: number };
    return result.count;
  },
};
