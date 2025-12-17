import { apiClient } from "./client";
import {
  type RatingInput,
  type RatingResponse,
  ratingResponseSchema,
} from "./types";

function getCsrfToken(): string {
  const match = document.cookie.match(/csrf_token=([^;]+)/);
  return match ? match[1] : "";
}

export const ratingsApi = {
  rateTitle: async (titleId: number, data: RatingInput): Promise<RatingResponse> => {
    const response = await apiClient.post<RatingResponse>(
      `/ratings/${titleId}`,
      data,
      { headers: { "x-csrf-token": getCsrfToken() } }
    );
    return ratingResponseSchema.parse(response.data);
  },

  removeRating: async (titleId: number): Promise<void> => {
    await apiClient.delete(`/ratings/${titleId}`, {
      headers: { "x-csrf-token": getCsrfToken() },
    });
  },
};
