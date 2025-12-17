import db from "../db/database.js";
import type { SavedProperty, SavedWithHotel } from "../types/index.js";

export class SavedRepository {
  findByUserId(userId: number): SavedWithHotel[] {
    return db
      .prepare(
        `SELECT sp.*,
          h.name as hotel_name,
          h.description as hotel_description,
          h.city as hotel_city,
          h.country as hotel_country,
          h.address as hotel_address,
          h.price_per_night as hotel_price_per_night,
          h.rating as hotel_rating,
          h.review_count as hotel_review_count,
          h.images as hotel_images,
          h.amenities as hotel_amenities
         FROM saved_properties sp
         JOIN hotels h ON sp.hotel_id = h.id
         WHERE sp.user_id = ?
         ORDER BY sp.created_at DESC`
      )
      .all(userId) as SavedWithHotel[];
  }

  findByUserAndHotel(
    userId: number,
    hotelId: number
  ): SavedProperty | undefined {
    return db
      .prepare(
        "SELECT * FROM saved_properties WHERE user_id = ? AND hotel_id = ?"
      )
      .get(userId, hotelId) as SavedProperty | undefined;
  }

  create(userId: number, hotelId: number): number {
    const result = db
      .prepare("INSERT INTO saved_properties (user_id, hotel_id) VALUES (?, ?)")
      .run(userId, hotelId);
    return result.lastInsertRowid as number;
  }

  delete(userId: number, hotelId: number): void {
    db.prepare(
      "DELETE FROM saved_properties WHERE user_id = ? AND hotel_id = ?"
    ).run(userId, hotelId);
  }

  isSaved(userId: number, hotelId: number): boolean {
    const result = db
      .prepare(
        "SELECT 1 FROM saved_properties WHERE user_id = ? AND hotel_id = ?"
      )
      .get(userId, hotelId);
    return !!result;
  }
}

export const savedRepository = new SavedRepository();
