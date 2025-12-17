import { apiClient } from "./client";
import {
  reviewsResponseSchema,
  type ReviewsResponse,
  type CreateReviewInput,
  type Review,
} from "./types";

export const reviewsApi = {
  getHotelReviews: async (hotelId: number): Promise<ReviewsResponse> => {
    const response = await apiClient.get(`/reviews/hotel/${hotelId}`);
    return reviewsResponseSchema.parse(response.data);
  },

  create: async (
    data: CreateReviewInput
  ): Promise<{ message: string; review: Review }> => {
    const response = await apiClient.post("/reviews", data);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/reviews/${id}`);
    return response.data;
  },
};
