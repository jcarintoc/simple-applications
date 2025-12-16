import db from "../db/database.js";
import type { Video, VideoWithUser, CreateVideoDto, UpdateVideoDto } from "../types/index.js";

export const videoRepository = {
  findAll(limit = 20, offset = 0, userId?: number): VideoWithUser[] {
    const query = `
      SELECT
        v.*,
        u.name as user_name,
        u.email as user_email,
        (SELECT COUNT(*) FROM video_likes WHERE video_id = v.id) as like_count,
        (SELECT COUNT(*) FROM comments WHERE video_id = v.id) as comment_count
        ${userId ? `, (SELECT COUNT(*) FROM video_likes WHERE video_id = v.id AND user_id = ?) as is_liked` : ""}
      FROM videos v
      JOIN users u ON v.user_id = u.id
      ORDER BY v.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const params = userId ? [userId, limit, offset] : [limit, offset];
    const videos = db.prepare(query).all(...params) as VideoWithUser[];

    return videos.map(v => ({
      ...v,
      is_liked: userId ? Boolean(v.is_liked) : undefined
    }));
  },

  findById(id: number, userId?: number): VideoWithUser | undefined {
    const query = `
      SELECT
        v.*,
        u.name as user_name,
        u.email as user_email,
        (SELECT COUNT(*) FROM video_likes WHERE video_id = v.id) as like_count,
        (SELECT COUNT(*) FROM comments WHERE video_id = v.id) as comment_count
        ${userId ? `, (SELECT COUNT(*) FROM video_likes WHERE video_id = v.id AND user_id = ?) as is_liked` : ""}
      FROM videos v
      JOIN users u ON v.user_id = u.id
      WHERE v.id = ?
    `;

    const params = userId ? [userId, id] : [id];
    const video = db.prepare(query).get(...params) as VideoWithUser | undefined;

    if (video && userId !== undefined) {
      video.is_liked = Boolean(video.is_liked);
    }

    return video;
  },

  findByUserId(userId: number, limit = 20, offset = 0): VideoWithUser[] {
    const query = `
      SELECT
        v.*,
        u.name as user_name,
        u.email as user_email,
        (SELECT COUNT(*) FROM video_likes WHERE video_id = v.id) as like_count,
        (SELECT COUNT(*) FROM comments WHERE video_id = v.id) as comment_count
      FROM videos v
      JOIN users u ON v.user_id = u.id
      WHERE v.user_id = ?
      ORDER BY v.created_at DESC
      LIMIT ? OFFSET ?
    `;

    return db.prepare(query).all(userId, limit, offset) as VideoWithUser[];
  },

  create(userId: number, data: CreateVideoDto): number {
    const stmt = db.prepare(`
      INSERT INTO videos (user_id, title, description, filename)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(userId, data.title, data.description || null, data.filename);
    return result.lastInsertRowid as number;
  },

  update(id: number, data: UpdateVideoDto): boolean {
    const fields: string[] = [];
    const values: (string | number)[] = [];

    if (data.title !== undefined) {
      fields.push("title = ?");
      values.push(data.title);
    }
    if (data.description !== undefined) {
      fields.push("description = ?");
      values.push(data.description);
    }

    if (fields.length === 0) return false;

    values.push(id);
    const stmt = db.prepare(`UPDATE videos SET ${fields.join(", ")} WHERE id = ?`);
    const result = stmt.run(...values);

    return result.changes > 0;
  },

  delete(id: number): boolean {
    const stmt = db.prepare("DELETE FROM videos WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  },

  incrementViews(id: number): boolean {
    const stmt = db.prepare("UPDATE videos SET views = views + 1 WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  },

  getOwner(id: number): number | undefined {
    const video = db.prepare("SELECT user_id FROM videos WHERE id = ?").get(id) as { user_id: number } | undefined;
    return video?.user_id;
  },

  count(): number {
    const result = db.prepare("SELECT COUNT(*) as count FROM videos").get() as { count: number };
    return result.count;
  },

  countByUserId(userId: number): number {
    const result = db.prepare("SELECT COUNT(*) as count FROM videos WHERE user_id = ?").get(userId) as { count: number };
    return result.count;
  },

  search(query: string, limit = 20, offset = 0): VideoWithUser[] {
    const searchQuery = `
      SELECT
        v.*,
        u.name as user_name,
        u.email as user_email,
        (SELECT COUNT(*) FROM video_likes WHERE video_id = v.id) as like_count,
        (SELECT COUNT(*) FROM comments WHERE video_id = v.id) as comment_count
      FROM videos v
      JOIN users u ON v.user_id = u.id
      WHERE v.title LIKE ? OR v.description LIKE ?
      ORDER BY v.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const searchTerm = `%${query}%`;
    return db.prepare(searchQuery).all(searchTerm, searchTerm, limit, offset) as VideoWithUser[];
  }
};
