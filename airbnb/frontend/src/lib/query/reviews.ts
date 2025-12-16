import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewsApi, type CreateReviewInput } from "../api";

export const reviewKeys = {
  all: ["reviews"] as const,
  lists: () => [...reviewKeys.all, "list"] as const,
  list: (propertyId: number) => [...reviewKeys.lists(), propertyId] as const,
};

export function useReviews(propertyId: number) {
  return useQuery({
    queryKey: reviewKeys.list(propertyId),
    queryFn: () => reviewsApi.getReviewsByProperty(propertyId),
    enabled: !!propertyId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, data }: { propertyId: number; data: CreateReviewInput }) =>
      reviewsApi.createReview(propertyId, data),
    onSuccess: (_, { propertyId }) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.list(propertyId) });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, propertyId }: { id: number; propertyId: number }) =>
      reviewsApi.deleteReview(id, propertyId),
    onSuccess: (_, { propertyId }) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.list(propertyId) });
    },
  });
}
