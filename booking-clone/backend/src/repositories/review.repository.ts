import db from "../db/database.js";
import type { Review, ReviewWithUser, CreateReviewDto } from "../types/index.js";

export class ReviewRepository {
  findByHotelId(hotelId: number): ReviewWithUser[] {
    return db
      .prepare(
        `SELECT r.*, u.name as user_name
         FROM reviews r
         JOIN users u ON r.user_id = u.id
         WHERE r.hotel_id = ?
         ORDER BY r.created_at DESC`
      )
      .all(hotelId) as ReviewWithUser[];
  }

  findByUserIdAndBookingId(
    userId: number,
    bookingId: number
  ): Review | undefined {
    return db
      .prepare("SELECT * FROM reviews WHERE user_id = ? AND booking_id = ?")
      .get(userId, bookingId) as Review | undefined;
  }

  findById(id: number): Review | undefined {
    return db.prepare("SELECT * FROM reviews WHERE id = ?").get(id) as
      | Review
      | undefined;
  }

  create(userId: number, data: CreateReviewDto): number {
    const result = db
      .prepare(
        `INSERT INTO reviews (user_id, hotel_id, booking_id, rating, title, comment)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(
        userId,
        data.hotelId,
        data.bookingId,
        data.rating,
        data.title,
        data.comment
      );
    return result.lastInsertRowid as number;
  }

  getHotelAverageRating(hotelId: number): { avgRating: number; count: number } {
    const result = db
      .prepare(
        `SELECT AVG(rating) as avgRating, COUNT(*) as count
         FROM reviews WHERE hotel_id = ?`
      )
      .get(hotelId) as { avgRating: number | null; count: number };
    return { avgRating: result.avgRating || 0, count: result.count };
  }

  delete(id: number): void {
    db.prepare("DELETE FROM reviews WHERE id = ?").run(id);
  }
}

export const reviewRepository = new ReviewRepository();
