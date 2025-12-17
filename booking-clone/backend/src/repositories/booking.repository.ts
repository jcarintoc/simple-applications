import db from "../db/database.js";
import type { Booking } from "../types/index.js";

export class BookingRepository {
  findById(id: number): Booking | undefined {
    return db.prepare("SELECT * FROM bookings WHERE id = ?").get(id) as
      | Booking
      | undefined;
  }

  findByUserId(userId: number): Booking[] {
    return db
      .prepare("SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC")
      .all(userId) as Booking[];
  }

  findByUserIdAndHotelId(userId: number, hotelId: number): Booking[] {
    return db
      .prepare(
        "SELECT * FROM bookings WHERE user_id = ? AND hotel_id = ? AND status = 'completed'"
      )
      .all(userId, hotelId) as Booking[];
  }

  create(
    userId: number,
    hotelId: number,
    checkInDate: string,
    checkOutDate: string,
    guests: number,
    rooms: number,
    totalPrice: number
  ): number {
    const result = db
      .prepare(
        `INSERT INTO bookings (user_id, hotel_id, check_in_date, check_out_date, guests, rooms, total_price)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(userId, hotelId, checkInDate, checkOutDate, guests, rooms, totalPrice);
    return result.lastInsertRowid as number;
  }

  updateStatus(id: number, status: string): void {
    db.prepare("UPDATE bookings SET status = ? WHERE id = ?").run(status, id);
  }

  delete(id: number): void {
    db.prepare("DELETE FROM bookings WHERE id = ?").run(id);
  }

  getCompletedBookingsForReview(userId: number): Booking[] {
    const today = new Date().toISOString().split("T")[0];
    return db
      .prepare(
        `SELECT b.* FROM bookings b
         LEFT JOIN reviews r ON b.id = r.booking_id
         WHERE b.user_id = ?
         AND b.check_out_date < ?
         AND b.status = 'confirmed'
         AND r.id IS NULL
         ORDER BY b.check_out_date DESC`
      )
      .all(userId, today) as Booking[];
  }
}

export const bookingRepository = new BookingRepository();
