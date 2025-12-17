import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { reviewService } from "../services/index.js";

export class ReviewController {
  create(req: AuthRequest, res: Response): void {
    const { hotelId, bookingId, rating, title, comment } = req.body;

    if (!hotelId || !bookingId || !rating || !title || !comment) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({ error: "Rating must be between 1 and 5" });
      return;
    }

    try {
      const review = reviewService.create(req.userId!, {
        hotelId,
        bookingId,
        rating,
        title,
        comment,
      });
      res.status(201).json({ message: "Review created", review });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Review failed";
      res.status(400).json({ error: message });
    }
  }

  getHotelReviews(req: Request, res: Response): void {
    const hotelId = parseInt(req.params.hotelId);
    const reviews = reviewService.getHotelReviews(hotelId);
    res.json({ reviews });
  }

  delete(req: AuthRequest, res: Response): void {
    const reviewId = parseInt(req.params.id);

    try {
      reviewService.delete(req.userId!, reviewId);
      res.json({ message: "Review deleted" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Delete failed";
      const status = message.includes("authorized") ? 403 : 400;
      res.status(status).json({ error: message });
    }
  }
}

export const reviewController = new ReviewController();
