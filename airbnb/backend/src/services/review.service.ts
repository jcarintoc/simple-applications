import { reviewRepository } from "../repositories/review.repository.js";
import type { Review, ReviewWithUser, CreateReviewDto } from "../types/index.js";

export class ReviewService {
  getReviewsByProperty(propertyId: number): ReviewWithUser[] {
    return reviewRepository.findByProperty(propertyId);
  }

  createReview(propertyId: number, userId: number, data: CreateReviewDto): Review {
    // Check if user already reviewed this property
    const existingReview = reviewRepository.findByPropertyAndUser(propertyId, userId);
    if (existingReview) {
      throw new Error("You have already reviewed this property");
    }

    // Validate rating
    if (data.rating < 1 || data.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const id = reviewRepository.create(propertyId, userId, data);
    const review = reviewRepository.findById(id);
    if (!review) {
      throw new Error("Failed to create review");
    }

    return review;
  }

  deleteReview(id: number, userId: number): boolean {
    const review = reviewRepository.findById(id);
    if (!review || review.user_id !== userId) {
      return false;
    }

    return reviewRepository.delete(id);
  }
}

export const reviewService = new ReviewService();
