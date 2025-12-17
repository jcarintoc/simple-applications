import {
  bookingRepository,
  hotelRepository,
  csrfRepository,
} from "../repositories/index.js";
import type {
  Booking,
  CreateBookingDto,
  BookingResponse,
} from "../types/index.js";
import { hotelService } from "./hotel.service.js";

export class BookingService {
  create(userId: number, data: CreateBookingDto): BookingResponse {
    // Validate CSRF token
    if (!csrfRepository.validate(userId, data.csrfToken)) {
      throw new Error("Invalid or expired CSRF token");
    }

    const hotel = hotelRepository.findById(data.hotelId);
    if (!hotel) {
      throw new Error("Hotel not found");
    }

    // Calculate nights and total price
    const checkIn = new Date(data.checkInDate);
    const checkOut = new Date(data.checkOutDate);
    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (nights <= 0) {
      throw new Error("Check-out date must be after check-in date");
    }

    const totalPrice = nights * hotel.price_per_night * data.rooms;

    const bookingId = bookingRepository.create(
      userId,
      data.hotelId,
      data.checkInDate,
      data.checkOutDate,
      data.guests,
      data.rooms,
      totalPrice
    );

    const booking = bookingRepository.findById(bookingId)!;
    return this.toBookingResponse(booking);
  }

  getUserBookings(userId: number): BookingResponse[] {
    const bookings = bookingRepository.findByUserId(userId);
    return bookings.map((booking) => {
      const response = this.toBookingResponse(booking);
      const hotel = hotelService.getById(booking.hotel_id);
      if (hotel) {
        response.hotel = hotel;
      }
      return response;
    });
  }

  cancel(userId: number, bookingId: number): void {
    const booking = bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }
    if (booking.user_id !== userId) {
      throw new Error("Not authorized to cancel this booking");
    }
    if (booking.status === "cancelled") {
      throw new Error("Booking already cancelled");
    }
    bookingRepository.updateStatus(bookingId, "cancelled");
  }

  private toBookingResponse(booking: Booking): BookingResponse {
    return {
      id: booking.id,
      hotelId: booking.hotel_id,
      checkInDate: booking.check_in_date,
      checkOutDate: booking.check_out_date,
      guests: booking.guests,
      rooms: booking.rooms,
      totalPrice: booking.total_price,
      status: booking.status,
      createdAt: booking.created_at,
    };
  }
}

export const bookingService = new BookingService();
