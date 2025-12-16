import { apiClient } from "./client";
import {
  type BookingWithProperty,
  type CreateBookingInput,
  bookingsResponseSchema,
  bookingResponseSchema,
} from "./types";

export const bookingsApi = {
  getMyBookings: async (): Promise<BookingWithProperty[]> => {
    const response = await apiClient.get("/bookings");
    return bookingsResponseSchema.parse(response.data).bookings;
  },

  createBooking: async (data: CreateBookingInput): Promise<Booking> => {
    const response = await apiClient.post("/bookings", data);
    return bookingResponseSchema.parse(response.data).booking;
  },

  cancelBooking: async (id: number): Promise<void> => {
    await apiClient.patch(`/bookings/${id}/cancel`);
  },
};
