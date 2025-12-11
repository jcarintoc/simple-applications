import db from "../db/database.js";
import type { Palette, CreatePaletteDto, UpdatePaletteDto } from "../types/index.js";

export class PaletteRepository {
  findByUserId(userId: number): Palette[] {
    return db
      .prepare("SELECT * FROM palettes WHERE user_id = ? ORDER BY created_at DESC")
      .all(userId) as Palette[];
  }

  findById(id: number): Palette | undefined {
    return db.prepare("SELECT * FROM palettes WHERE id = ?").get(id) as Palette | undefined;
  }

  findByIdAndUserId(id: number, userId: number): Palette | undefined {
    return db
      .prepare("SELECT * FROM palettes WHERE id = ? AND user_id = ?")
      .get(id, userId) as Palette | undefined;
  }

  create(userId: number, data: CreatePaletteDto): number {
    const colorsJson = JSON.stringify(data.colors);
    const result = db
      .prepare("INSERT INTO palettes (user_id, name, colors) VALUES (?, ?, ?)")
      .run(userId, data.name, colorsJson);
    return result.lastInsertRowid as number;
  }

  update(id: number, userId: number, data: UpdatePaletteDto): boolean {
    const palette = this.findByIdAndUserId(id, userId);
    if (!palette) return false;

    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (data.name !== undefined) {
      updates.push("name = ?");
      values.push(data.name);
    }

    if (data.colors !== undefined) {
      updates.push("colors = ?");
      values.push(JSON.stringify(data.colors));
    }

    if (updates.length === 0) return true;

    values.push(id, userId);
    const result = db
      .prepare(`UPDATE palettes SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`)
      .run(...values);

    return result.changes > 0;
  }

  delete(id: number, userId: number): boolean {
    const result = db
      .prepare("DELETE FROM palettes WHERE id = ? AND user_id = ?")
      .run(id, userId);
    return result.changes > 0;
  }
}

export const paletteRepository = new PaletteRepository();

