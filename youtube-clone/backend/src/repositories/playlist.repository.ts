import db from "../db/database.js";
import type { Playlist, PlaylistWithDetails, PlaylistVideo, Video } from "../types/index.js";

export const playlistRepository = {
  findByUserId(userId: number): PlaylistWithDetails[] {
    const query = `
      SELECT
        p.*,
        u.name as user_name,
        (SELECT COUNT(*) FROM playlist_videos WHERE playlist_id = p.id) as video_count
      FROM playlists p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `;
    return db.prepare(query).all(userId) as PlaylistWithDetails[];
  },

  findById(id: number): Playlist | undefined {
    return db.prepare("SELECT * FROM playlists WHERE id = ?").get(id) as Playlist | undefined;
  },

  findByIdWithDetails(id: number): PlaylistWithDetails | undefined {
    const query = `
      SELECT
        p.*,
        u.name as user_name,
        (SELECT COUNT(*) FROM playlist_videos WHERE playlist_id = p.id) as video_count
      FROM playlists p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `;
    return db.prepare(query).get(id) as PlaylistWithDetails | undefined;
  },

  getVideos(playlistId: number): (Video & { position: number })[] {
    const query = `
      SELECT
        v.*,
        u.name as user_name,
        u.email as user_email,
        pv.position,
        (SELECT COUNT(*) FROM video_likes WHERE video_id = v.id) as like_count,
        (SELECT COUNT(*) FROM comments WHERE video_id = v.id) as comment_count
      FROM playlist_videos pv
      JOIN videos v ON pv.video_id = v.id
      JOIN users u ON v.user_id = u.id
      WHERE pv.playlist_id = ?
      ORDER BY pv.position ASC
    `;
    return db.prepare(query).all(playlistId) as (Video & { position: number })[];
  },

  create(userId: number, name: string, description: string | null, isPublic: boolean): number {
    const stmt = db.prepare(
      "INSERT INTO playlists (user_id, name, description, is_public) VALUES (?, ?, ?, ?)"
    );
    const result = stmt.run(userId, name, description, isPublic ? 1 : 0);
    return result.lastInsertRowid as number;
  },

  update(id: number, name?: string, description?: string | null, isPublic?: boolean): boolean {
    const fields: string[] = [];
    const values: (string | number | null)[] = [];

    if (name !== undefined) {
      fields.push("name = ?");
      values.push(name);
    }
    if (description !== undefined) {
      fields.push("description = ?");
      values.push(description);
    }
    if (isPublic !== undefined) {
      fields.push("is_public = ?");
      values.push(isPublic ? 1 : 0);
    }

    if (fields.length === 0) return false;

    values.push(id);
    const stmt = db.prepare(`UPDATE playlists SET ${fields.join(", ")} WHERE id = ?`);
    const result = stmt.run(...values);

    return result.changes > 0;
  },

  delete(id: number): boolean {
    const stmt = db.prepare("DELETE FROM playlists WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  },

  addVideo(playlistId: number, videoId: number): boolean {
    try {
      const maxPosition = db.prepare(
        "SELECT COALESCE(MAX(position), -1) as max_pos FROM playlist_videos WHERE playlist_id = ?"
      ).get(playlistId) as { max_pos: number };

      db.prepare(
        "INSERT INTO playlist_videos (playlist_id, video_id, position) VALUES (?, ?, ?)"
      ).run(playlistId, videoId, maxPosition.max_pos + 1);

      return true;
    } catch {
      return false;
    }
  },

  removeVideo(playlistId: number, videoId: number): boolean {
    const stmt = db.prepare(
      "DELETE FROM playlist_videos WHERE playlist_id = ? AND video_id = ?"
    );
    const result = stmt.run(playlistId, videoId);
    return result.changes > 0;
  },

  hasVideo(playlistId: number, videoId: number): boolean {
    const result = db.prepare(
      "SELECT id FROM playlist_videos WHERE playlist_id = ? AND video_id = ?"
    ).get(playlistId, videoId);
    return !!result;
  },

  getOwner(id: number): number | undefined {
    const playlist = db.prepare("SELECT user_id FROM playlists WHERE id = ?").get(id) as { user_id: number } | undefined;
    return playlist?.user_id;
  },
};
