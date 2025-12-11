import db from "../db/database.js";
import type { SavedPassword, SavePasswordDto } from "../types/index.js";

export class PasswordRepository {
  findByUserId(userId: number): SavedPassword[] {
    const stmt = db.prepare(`
      SELECT * FROM saved_passwords 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `);
    return stmt.all(userId) as SavedPassword[];
  }

  findById(id: number): SavedPassword | undefined {
    const stmt = db.prepare("SELECT * FROM saved_passwords WHERE id = ?");
    return stmt.get(id) as SavedPassword | undefined;
  }

  findByIdAndUserId(id: number, userId: number): SavedPassword | undefined {
    const stmt = db.prepare(
      "SELECT * FROM saved_passwords WHERE id = ? AND user_id = ?"
    );
    return stmt.get(id, userId) as SavedPassword | undefined;
  }

  create(userId: number, data: SavePasswordDto): SavedPassword {
    const stmt = db.prepare(`
      INSERT INTO saved_passwords (user_id, password, label, length, has_uppercase, has_lowercase, has_numbers, has_symbols)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      userId,
      data.password,
      data.label || null,
      data.length,
      data.hasUppercase ? 1 : 0,
      data.hasLowercase ? 1 : 0,
      data.hasNumbers ? 1 : 0,
      data.hasSymbols ? 1 : 0
    );

    return this.findById(result.lastInsertRowid as number)!;
  }

  delete(id: number, userId: number): boolean {
    const stmt = db.prepare(
      "DELETE FROM saved_passwords WHERE id = ? AND user_id = ?"
    );
    const result = stmt.run(id, userId);
    return result.changes > 0;
  }

  deleteAll(userId: number): number {
    const stmt = db.prepare("DELETE FROM saved_passwords WHERE user_id = ?");
    const result = stmt.run(userId);
    return result.changes;
  }
}

export const passwordRepository = new PasswordRepository();

