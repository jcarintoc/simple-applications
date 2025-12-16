import { bookingRepository } from "../repositories/booking.repository.js";
import { propertyRepository } from "../repositories/property.repository.js";
import type { Booking, BookingWithProperty, CreateBookingDto } from "../types/index.js";

export class BookingService {
  getBookingsByGuest(guestId: number): BookingWithProperty[] {
    return bookingRepository.findByGuest(guestId);
  }

  getBookingsByProperty(propertyId: number): BookingWithProperty[] {
    const bookings = bookingRepository.findByProperty(propertyId);
    // Transform to match BookingWithProperty type
    return bookings.map((b) => ({
      id: b.id,
      property_id: b.property_id,
      guest_id: b.guest_id,
      check_in: b.check_in,
      check_out: b.check_out,
      total_price: b.total_price,
      status: b.status,
      created_at: b.created_at,
      property_title: "",
      property_location: "",
      property_image_url: null,
    }));
  }

  calculateTotalPrice(propertyId: number, checkIn: string, checkOut: string): number {
    const property = propertyRepository.findById(propertyId);
    if (!property) {
      throw new Error("Property not found");
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

    return property.price_per_night * nights;
  }

  createBooking(propertyId: number, guestId: number, data: CreateBookingDto): Booking {
    // Validate property exists
    const property = propertyRepository.findById(propertyId);
    if (!property) {
      throw new Error("Property not found");
    }

    // Check guest count
    if (data.guests > property.max_guests) {
      throw new Error(`Property can only accommodate ${property.max_guests} guests`);
    }

    // Validate dates
    const checkIn = new Date(data.check_in);
    const checkOut = new Date(data.check_out);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      throw new Error("Check-in date cannot be in the past");
    }

    if (checkOut <= checkIn) {
      throw new Error("Check-out date must be after check-in date");
    }

    // Check availability
    if (!bookingRepository.checkAvailability(propertyId, data.check_in, data.check_out)) {
      throw new Error("Property is not available for the selected dates");
    }

    // Calculate total price
    const totalPrice = this.calculateTotalPrice(propertyId, data.check_in, data.check_out);

    // Create booking
    const id = bookingRepository.create(propertyId, guestId, data, totalPrice);
    const booking = bookingRepository.findById(id);
    if (!booking) {
      throw new Error("Failed to create booking");
    }

    return booking;
  }

  cancelBooking(id: number, userId: number): boolean {
    const booking = bookingRepository.findById(id);
    if (!booking) {
      return false;
    }

    // Only guest or property owner can cancel
    const property = propertyRepository.findById(booking.property_id);
    if (!property || (booking.guest_id !== userId && property.owner_id !== userId)) {
      return false;
    }

    // Can't cancel already cancelled bookings
    if (booking.status === "cancelled") {
      return false;
    }

    return bookingRepository.cancel(id);
  }
}

export const bookingService = new BookingService();
