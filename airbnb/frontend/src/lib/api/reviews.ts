import { apiClient } from "./client";
import {
  type ReviewWithUser,
  type CreateReviewInput,
  reviewsResponseSchema,
  reviewResponseSchema,
} from "./types";

export const reviewsApi = {
  getReviewsByProperty: async (propertyId: number): Promise<ReviewWithUser[]> => {
    const response = await apiClient.get(`/properties/${propertyId}/reviews`);
    return reviewsResponseSchema.parse(response.data).reviews;
  },

  createReview: async (propertyId: number, data: CreateReviewInput): Promise<ReviewWithUser> => {
    const response = await apiClient.post(`/properties/${propertyId}/reviews`, data);
    return reviewResponseSchema.parse(response.data).review as ReviewWithUser;
  },

  deleteReview: async (id: number, propertyId: number): Promise<void> => {
    await apiClient.delete(`/properties/${propertyId}/reviews/${id}`);
  },
};
