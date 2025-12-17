import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { bookingService } from "../services/index.js";

export class BookingController {
  create(req: AuthRequest, res: Response): void {
    const { hotelId, checkInDate, checkOutDate, guests, rooms, csrfToken } =
      req.body;

    if (!hotelId || !checkInDate || !checkOutDate || !csrfToken) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    try {
      const booking = bookingService.create(req.userId!, {
        hotelId,
        checkInDate,
        checkOutDate,
        guests: guests || 1,
        rooms: rooms || 1,
        csrfToken,
      });
      res.status(201).json({ message: "Booking created", booking });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Booking failed";
      const status = message.includes("CSRF") ? 403 : 400;
      res.status(status).json({ error: message });
    }
  }

  getUserBookings(req: AuthRequest, res: Response): void {
    const bookings = bookingService.getUserBookings(req.userId!);
    res.json({ bookings });
  }

  cancel(req: AuthRequest, res: Response): void {
    const bookingId = parseInt(req.params.id);

    try {
      bookingService.cancel(req.userId!, bookingId);
      res.json({ message: "Booking cancelled" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Cancel failed";
      const status = message.includes("authorized") ? 403 : 400;
      res.status(status).json({ error: message });
    }
  }
}

export const bookingController = new BookingController();
