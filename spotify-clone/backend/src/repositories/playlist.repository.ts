import { db } from "../db/database.js";
import type { Playlist, PlaylistWithSongs, CreatePlaylistDto, UpdatePlaylistDto, Song, SongWithLiked } from "../types/index.js";

export const playlistRepository = {
  findAllByUserId(userId: number): Playlist[] {
    const stmt = db.prepare("SELECT * FROM playlists WHERE user_id = ? ORDER BY created_at DESC");
    return stmt.all(userId) as Playlist[];
  },

  findById(id: number): Playlist | undefined {
    const stmt = db.prepare("SELECT * FROM playlists WHERE id = ?");
    return stmt.get(id) as Playlist | undefined;
  },

  findByIdWithSongs(id: number, userId: number): PlaylistWithSongs | undefined {
    const playlist = this.findById(id);
    if (!playlist) return undefined;

    const songsStmt = db.prepare(`
      SELECT s.*,
        CASE WHEN ls.id IS NOT NULL THEN 1 ELSE 0 END as is_liked
      FROM playlist_songs ps
      JOIN songs s ON ps.song_id = s.id
      LEFT JOIN liked_songs ls ON s.id = ls.song_id AND ls.user_id = ?
      WHERE ps.playlist_id = ?
      ORDER BY ps.position ASC
    `);

    const songs = (songsStmt.all(userId, id) as (Song & { is_liked: number })[]).map((s) => ({
      ...s,
      is_liked: Boolean(s.is_liked),
    })) as SongWithLiked[];

    return {
      ...playlist,
      songs,
      song_count: songs.length,
    };
  },

  create(userId: number, data: CreatePlaylistDto): Playlist {
    const stmt = db.prepare(`
      INSERT INTO playlists (name, description, user_id)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(data.name, data.description || null, userId);
    return this.findById(result.lastInsertRowid as number)!;
  },

  update(id: number, data: UpdatePlaylistDto): Playlist | undefined {
    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (data.name !== undefined) {
      updates.push("name = ?");
      values.push(data.name);
    }
    if (data.description !== undefined) {
      updates.push("description = ?");
      values.push(data.description);
    }

    if (updates.length === 0) return this.findById(id);

    values.push(id);
    const stmt = db.prepare(`UPDATE playlists SET ${updates.join(", ")} WHERE id = ?`);
    stmt.run(...values);
    return this.findById(id);
  },

  delete(id: number): boolean {
    const stmt = db.prepare("DELETE FROM playlists WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  },

  addSong(playlistId: number, songId: number): boolean {
    try {
      // Get max position
      const posStmt = db.prepare("SELECT COALESCE(MAX(position), -1) + 1 as next_pos FROM playlist_songs WHERE playlist_id = ?");
      const { next_pos } = posStmt.get(playlistId) as { next_pos: number };

      const stmt = db.prepare(`
        INSERT INTO playlist_songs (playlist_id, song_id, position)
        VALUES (?, ?, ?)
      `);
      stmt.run(playlistId, songId, next_pos);
      return true;
    } catch {
      return false; // Song already in playlist (unique constraint)
    }
  },

  removeSong(playlistId: number, songId: number): boolean {
    const stmt = db.prepare("DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id = ?");
    const result = stmt.run(playlistId, songId);
    return result.changes > 0;
  },

  hasSong(playlistId: number, songId: number): boolean {
    const stmt = db.prepare("SELECT 1 FROM playlist_songs WHERE playlist_id = ? AND song_id = ?");
    return !!stmt.get(playlistId, songId);
  },
};
