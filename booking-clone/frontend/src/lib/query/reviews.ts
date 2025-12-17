import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewsApi, type CreateReviewInput } from "../api";
import { hotelKeys } from "./hotels";

export const reviewKeys = {
  all: ["reviews"] as const,
  hotel: (hotelId: number) => [...reviewKeys.all, "hotel", hotelId] as const,
};

export function useHotelReviews(hotelId: number) {
  return useQuery({
    queryKey: reviewKeys.hotel(hotelId),
    queryFn: () => reviewsApi.getHotelReviews(hotelId),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewInput) => reviewsApi.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.hotel(variables.hotelId),
      });
      queryClient.invalidateQueries({
        queryKey: hotelKeys.detail(variables.hotelId),
      });
    },
  });
}

export function useDeleteReview(hotelId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => reviewsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.hotel(hotelId) });
      queryClient.invalidateQueries({ queryKey: hotelKeys.detail(hotelId) });
    },
  });
}
