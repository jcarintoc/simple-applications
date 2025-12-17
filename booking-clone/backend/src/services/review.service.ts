import {
  reviewRepository,
  bookingRepository,
  hotelRepository,
} from "../repositories/index.js";
import type {
  Review,
  CreateReviewDto,
  ReviewResponse,
  ReviewWithUser,
} from "../types/index.js";

export class ReviewService {
  create(userId: number, data: CreateReviewDto): ReviewResponse {
    // Verify user has a completed booking at this hotel
    const booking = bookingRepository.findById(data.bookingId);
    if (!booking || booking.user_id !== userId) {
      throw new Error("Invalid booking");
    }
    if (booking.hotel_id !== data.hotelId) {
      throw new Error("Booking does not match hotel");
    }

    // Check if checkout date has passed (completed stay)
    const checkOutDate = new Date(booking.check_out_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (checkOutDate >= today) {
      throw new Error("Can only review after checkout date");
    }

    // Check if already reviewed
    const existingReview = reviewRepository.findByUserIdAndBookingId(
      userId,
      data.bookingId
    );
    if (existingReview) {
      throw new Error("You have already reviewed this stay");
    }

    const reviewId = reviewRepository.create(userId, data);

    // Update hotel rating
    const { avgRating, count } = reviewRepository.getHotelAverageRating(
      data.hotelId
    );
    hotelRepository.updateRating(
      data.hotelId,
      Math.round(avgRating * 10) / 10,
      count
    );

    const review = reviewRepository.findById(reviewId)!;
    return {
      ...this.toReviewResponse(review),
      userName: "You",
    };
  }

  getHotelReviews(hotelId: number): ReviewResponse[] {
    const reviews = reviewRepository.findByHotelId(hotelId);
    return reviews.map((r) => ({
      ...this.toReviewResponse(r),
      userName: r.user_name,
    }));
  }

  delete(userId: number, reviewId: number): void {
    const review = reviewRepository.findById(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }
    if (review.user_id !== userId) {
      throw new Error("Not authorized to delete this review");
    }

    const hotelId = review.hotel_id;
    reviewRepository.delete(reviewId);

    // Update hotel rating
    const { avgRating, count } = reviewRepository.getHotelAverageRating(hotelId);
    hotelRepository.updateRating(
      hotelId,
      Math.round(avgRating * 10) / 10,
      count
    );
  }

  private toReviewResponse(
    review: Review | ReviewWithUser
  ): Omit<ReviewResponse, "userName"> & { userName?: string } {
    return {
      id: review.id,
      userId: review.user_id,
      hotelId: review.hotel_id,
      bookingId: review.booking_id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      createdAt: review.created_at,
    };
  }
}

export const reviewService = new ReviewService();
