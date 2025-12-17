import { apiClient } from "./client";
import {
  bookingsResponseSchema,
  bookingCreateResponseSchema,
  type BookingsResponse,
  type CreateBookingInput,
  type Booking,
} from "./types";

export const bookingsApi = {
  create: async (
    data: CreateBookingInput
  ): Promise<{ message: string; booking: Booking }> => {
    const response = await apiClient.post("/bookings", data);
    return bookingCreateResponseSchema.parse(response.data);
  },

  getMyBookings: async (): Promise<BookingsResponse> => {
    const response = await apiClient.get("/bookings");
    return bookingsResponseSchema.parse(response.data);
  },

  cancel: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/bookings/${id}`);
    return response.data;
  },
};
