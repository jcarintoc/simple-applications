import { db } from "../db/database.js";
import type { ContinueWatching, ContinueWatchingWithTitle, Title } from "../types/index.js";

export const continueWatchingRepository = {
  findBySessionId(sessionId: string): ContinueWatchingWithTitle[] {
    const stmt = db.prepare(`
      SELECT cw.*, t.title, t.type, t.description, t.genre, t.release_year,
             t.duration_minutes, t.seasons, t.thumbnail_url, t.created_at as title_created_at
      FROM continue_watching cw
      JOIN titles t ON cw.title_id = t.id
      WHERE cw.session_id = ? AND cw.progress_percent < 100
      ORDER BY cw.last_watched DESC
    `);
    const rows = stmt.all(sessionId) as (ContinueWatching & Title & { title_created_at: string })[];

    return rows.map((row) => ({
      id: row.id,
      session_id: row.session_id,
      title_id: row.title_id,
      progress_percent: row.progress_percent,
      last_watched: row.last_watched,
      title: {
        id: row.title_id,
        title: row.title,
        type: row.type,
        description: row.description,
        genre: row.genre,
        release_year: row.release_year,
        duration_minutes: row.duration_minutes,
        seasons: row.seasons,
        thumbnail_url: row.thumbnail_url,
        created_at: row.title_created_at,
      },
    }));
  },

  findBySessionAndTitle(sessionId: string, titleId: number): ContinueWatching | undefined {
    const stmt = db.prepare("SELECT * FROM continue_watching WHERE session_id = ? AND title_id = ?");
    return stmt.get(sessionId, titleId) as ContinueWatching | undefined;
  },

  updateProgress(sessionId: string, titleId: number, progressPercent: number): ContinueWatching {
    const existing = this.findBySessionAndTitle(sessionId, titleId);

    if (existing) {
      const stmt = db.prepare(`
        UPDATE continue_watching
        SET progress_percent = ?, last_watched = CURRENT_TIMESTAMP
        WHERE session_id = ? AND title_id = ?
      `);
      stmt.run(progressPercent, sessionId, titleId);
    } else {
      const stmt = db.prepare(`
        INSERT INTO continue_watching (session_id, title_id, progress_percent)
        VALUES (?, ?, ?)
      `);
      stmt.run(sessionId, titleId, progressPercent);
    }

    return this.findBySessionAndTitle(sessionId, titleId)!;
  },

  remove(sessionId: string, titleId: number): boolean {
    const stmt = db.prepare("DELETE FROM continue_watching WHERE session_id = ? AND title_id = ?");
    const result = stmt.run(sessionId, titleId);
    return result.changes > 0;
  },

  clearAll(sessionId: string): number {
    const stmt = db.prepare("DELETE FROM continue_watching WHERE session_id = ?");
    const result = stmt.run(sessionId);
    return result.changes;
  },
};
