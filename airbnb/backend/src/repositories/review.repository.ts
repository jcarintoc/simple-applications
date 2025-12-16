import db from "../db/database.js";
import type { Review, ReviewWithUser, CreateReviewDto } from "../types/index.js";

export class ReviewRepository {
  findByProperty(propertyId: number): ReviewWithUser[] {
    return db.prepare(`
      SELECT 
        r.*,
        u.name as user_name,
        u.email as user_email
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.property_id = ?
      ORDER BY r.created_at DESC
    `).all(propertyId) as ReviewWithUser[];
  }

  findById(id: number): Review | undefined {
    return db.prepare("SELECT * FROM reviews WHERE id = ?").get(id) as Review | undefined;
  }

  findByPropertyAndUser(propertyId: number, userId: number): Review | undefined {
    return db.prepare("SELECT * FROM reviews WHERE property_id = ? AND user_id = ?").get(propertyId, userId) as Review | undefined;
  }

  create(propertyId: number, userId: number, data: CreateReviewDto): number {
    const result = db.prepare(`
      INSERT INTO reviews (property_id, user_id, rating, comment)
      VALUES (?, ?, ?, ?)
    `).run(propertyId, userId, data.rating, data.comment);
    return result.lastInsertRowid as number;
  }

  delete(id: number): boolean {
    const result = db.prepare("DELETE FROM reviews WHERE id = ?").run(id);
    return result.changes > 0;
  }
}

export const reviewRepository = new ReviewRepository();
