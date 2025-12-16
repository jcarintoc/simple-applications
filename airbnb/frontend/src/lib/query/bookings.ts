import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingsApi, type CreateBookingInput } from "../api";

export const bookingKeys = {
  all: ["bookings"] as const,
  lists: () => [...bookingKeys.all, "list"] as const,
  myBookings: () => [...bookingKeys.lists(), "my-bookings"] as const,
};

export function useMyBookings() {
  return useQuery({
    queryKey: bookingKeys.myBookings(),
    queryFn: () => bookingsApi.getMyBookings(),
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingInput) => bookingsApi.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.myBookings() });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => bookingsApi.cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.myBookings() });
    },
  });
}
