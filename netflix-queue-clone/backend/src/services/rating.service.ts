import { ratingRepository, titleRepository } from "../repositories/index.js";
import type { Rating } from "../types/index.js";

export class RatingService {
  rateTitle(userId: number, titleId: number, rating: number): { success: boolean; rating?: Rating; avg_rating?: number | null; error?: string } {
    const title = titleRepository.findById(titleId);
    if (!title) {
      return { success: false, error: "Title not found" };
    }

    if (rating < 1 || rating > 5) {
      return { success: false, error: "Rating must be between 1 and 5" };
    }

    const savedRating = ratingRepository.rate(userId, titleId, rating);
    const avgRating = ratingRepository.getAverageRating(titleId);
    return { success: true, rating: savedRating, avg_rating: avgRating };
  }

  removeRating(userId: number, titleId: number): { success: boolean; error?: string } {
    const existing = ratingRepository.findByUserAndTitle(userId, titleId);
    if (!existing) {
      return { success: false, error: "No rating to remove" };
    }

    ratingRepository.remove(userId, titleId);
    return { success: true };
  }

  getAverageRating(titleId: number): number | null {
    return ratingRepository.getAverageRating(titleId);
  }
}

export const ratingService = new RatingService();
