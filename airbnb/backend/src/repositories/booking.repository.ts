import db from "../db/database.js";
import type { Booking, BookingWithProperty, BookingWithGuest, CreateBookingDto } from "../types/index.js";

export class BookingRepository {
  findByGuest(guestId: number): BookingWithProperty[] {
    return db.prepare(`
      SELECT 
        b.*,
        p.title as property_title,
        p.location as property_location,
        p.image_url as property_image_url
      FROM bookings b
      JOIN properties p ON b.property_id = p.id
      WHERE b.guest_id = ?
      ORDER BY b.created_at DESC
    `).all(guestId) as BookingWithProperty[];
  }

  findByProperty(propertyId: number): BookingWithGuest[] {
    return db.prepare(`
      SELECT 
        b.*,
        u.name as guest_name,
        u.email as guest_email
      FROM bookings b
      JOIN users u ON b.guest_id = u.id
      WHERE b.property_id = ?
      ORDER BY b.created_at DESC
    `).all(propertyId) as BookingWithGuest[];
  }

  findById(id: number): Booking | undefined {
    return db.prepare("SELECT * FROM bookings WHERE id = ?").get(id) as Booking | undefined;
  }

  checkAvailability(propertyId: number, checkIn: string, checkOut: string, excludeBookingId?: number): boolean {
    let query = `
      SELECT COUNT(*) as count FROM bookings
      WHERE property_id = ?
        AND status IN ('pending', 'confirmed')
        AND (
          (check_in <= ? AND check_out > ?) OR
          (check_in < ? AND check_out >= ?) OR
          (check_in >= ? AND check_out <= ?)
        )
    `;
    const params: unknown[] = [propertyId, checkIn, checkIn, checkOut, checkOut, checkIn, checkOut];

    if (excludeBookingId) {
      query += ` AND id != ?`;
      params.push(excludeBookingId);
    }

    const result = db.prepare(query).get(...params) as { count: number };
    return result.count === 0;
  }

  create(propertyId: number, guestId: number, data: CreateBookingDto, totalPrice: number): number {
    const result = db.prepare(`
      INSERT INTO bookings (property_id, guest_id, check_in, check_out, total_price, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `).run(propertyId, guestId, data.check_in, data.check_out, totalPrice);
    return result.lastInsertRowid as number;
  }

  cancel(id: number): boolean {
    const result = db.prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?").run(id);
    return result.changes > 0;
  }
}

export const bookingRepository = new BookingRepository();
