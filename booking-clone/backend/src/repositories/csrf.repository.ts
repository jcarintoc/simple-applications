import crypto from "crypto";
import db from "../db/database.js";
import type { CsrfToken } from "../types/index.js";

export class CsrfRepository {
  generate(userId: number): string {
    // Clean up expired tokens for this user
    db.prepare(
      "DELETE FROM csrf_tokens WHERE user_id = ? OR expires_at < datetime('now')"
    ).run(userId);

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes

    db.prepare(
      "INSERT INTO csrf_tokens (user_id, token, expires_at) VALUES (?, ?, ?)"
    ).run(userId, token, expiresAt);

    return token;
  }

  validate(userId: number, token: string): boolean {
    const result = db
      .prepare(
        `SELECT * FROM csrf_tokens
         WHERE user_id = ? AND token = ? AND expires_at > datetime('now')`
      )
      .get(userId, token) as CsrfToken | undefined;

    if (result) {
      // Delete used token (single-use)
      db.prepare("DELETE FROM csrf_tokens WHERE id = ?").run(result.id);
      return true;
    }
    return false;
  }

  cleanup(): void {
    db.prepare("DELETE FROM csrf_tokens WHERE expires_at < datetime('now')").run();
  }
}

export const csrfRepository = new CsrfRepository();
