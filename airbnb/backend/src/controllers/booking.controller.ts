import type { Request, Response } from "express";
import { bookingService } from "../services/booking.service.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import type { CreateBookingDto } from "../types/index.js";

export class BookingController {
  getMyBookings(req: AuthRequest, res: Response): void {
    const userId = req.userId!;

    try {
      const bookings = bookingService.getBookingsByGuest(userId);
      res.json({ bookings });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  }

  createBooking(req: AuthRequest, res: Response): void {
    const guestId = req.userId!;
    const data: CreateBookingDto = req.body;

    if (!data.property_id || !data.check_in || !data.check_out || !data.guests) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    try {
      const booking = bookingService.createBooking(data.property_id, guestId, data);
      res.status(201).json({ booking });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create booking";
      const status = message.includes("not found") || message.includes("cannot") || message.includes("not available") ? 400 : 500;
      res.status(status).json({ error: message });
    }
  }

  cancelBooking(req: AuthRequest, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const userId = req.userId!;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid booking ID" });
      return;
    }

    try {
      const success = bookingService.cancelBooking(id, userId);
      if (!success) {
        res.status(404).json({ error: "Booking not found or unauthorized" });
        return;
      }
      res.json({ message: "Booking cancelled successfully" });
    } catch (error) {
      console.error("Error cancelling booking:", error);
      res.status(500).json({ error: "Failed to cancel booking" });
    }
  }
}

export const bookingController = new BookingController();
