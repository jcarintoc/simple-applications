import db from "../db/database.js";
import type { Favorite, CreateFavoriteDto, FavoriteCategory } from "../types/index.js";

export class FavoriteRepository {
  findAllByUserId(userId: number): Favorite[] {
    return db
      .prepare("SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC")
      .all(userId) as Favorite[];
  }

  findById(id: number): Favorite | undefined {
    return db.prepare("SELECT * FROM favorites WHERE id = ?").get(id) as Favorite | undefined;
  }

  create(userId: number, data: CreateFavoriteDto): number {
    const result = db
      .prepare("INSERT INTO favorites (user_id, name, category) VALUES (?, ?, ?)")
      .run(userId, data.name, data.category);
    return result.lastInsertRowid as number;
  }

  delete(id: number, userId: number): boolean {
    const result = db
      .prepare("DELETE FROM favorites WHERE id = ? AND user_id = ?")
      .run(id, userId);
    return result.changes > 0;
  }

  update(id: number, userId: number, data: { name?: string; category?: FavoriteCategory }): boolean {
    if (!this.belongsToUser(id, userId)) {
      return false;
    }

    const updates: string[] = [];
    const values: unknown[] = [];

    if (data.name !== undefined) {
      updates.push("name = ?");
      values.push(data.name);
    }

    if (data.category !== undefined) {
      updates.push("category = ?");
      values.push(data.category);
    }

    if (updates.length === 0) {
      return true; // No updates to make
    }

    values.push(id, userId);
    const sql = `UPDATE favorites SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`;
    const result = db.prepare(sql).run(...values);
    return result.changes > 0;
  }

  belongsToUser(id: number, userId: number): boolean {
    const favorite = this.findById(id);
    return favorite?.user_id === userId;
  }
}

export const favoriteRepository = new FavoriteRepository();

