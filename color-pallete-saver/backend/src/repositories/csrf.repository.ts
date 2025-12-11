import db from "../db/database.js";

interface CsrfToken {
  id: number;
  user_id: number;
  token: string;
  expires_at: string;
}

export class CsrfRepository {
  findValidToken(userId: number, token: string): CsrfToken | undefined {
    return db
      .prepare(
        "SELECT * FROM csrf_tokens WHERE user_id = ? AND token = ? AND expires_at > datetime('now')"
      )
      .get(userId, token) as CsrfToken | undefined;
  }

  create(userId: number, token: string, expiresAt: Date): number {
    const result = db
      .prepare("INSERT INTO csrf_tokens (user_id, token, expires_at) VALUES (?, ?, ?)")
      .run(userId, token, expiresAt.toISOString());
    return result.lastInsertRowid as number;
  }

  deleteByToken(token: string): boolean {
    const result = db.prepare("DELETE FROM csrf_tokens WHERE token = ?").run(token);
    return result.changes > 0;
  }

  deleteExpired(): number {
    const result = db
      .prepare("DELETE FROM csrf_tokens WHERE expires_at <= datetime('now')")
      .run();
    return result.changes;
  }

  deleteByUserId(userId: number): number {
    const result = db.prepare("DELETE FROM csrf_tokens WHERE user_id = ?").run(userId);
    return result.changes;
  }
}

export const csrfRepository = new CsrfRepository();

