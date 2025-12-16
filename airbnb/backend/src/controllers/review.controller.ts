import type { Request, Response } from "express";
import { reviewService } from "../services/review.service.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import type { CreateReviewDto } from "../types/index.js";

export class ReviewController {
  getReviewsByProperty(req: Request, res: Response): void {
    const propertyId = parseInt(req.params.propertyId || req.params.id, 10);

    if (isNaN(propertyId)) {
      res.status(400).json({ error: "Invalid property ID" });
      return;
    }

    try {
      const reviews = reviewService.getReviewsByProperty(propertyId);
      res.json({ reviews });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  }

  createReview(req: AuthRequest, res: Response): void {
    const propertyId = parseInt(req.params.propertyId || req.params.id, 10);
    const userId = req.userId!;
    const data: CreateReviewDto = req.body;

    if (isNaN(propertyId)) {
      res.status(400).json({ error: "Invalid property ID" });
      return;
    }

    if (!data.rating || !data.comment) {
      res.status(400).json({ error: "Rating and comment are required" });
      return;
    }

    try {
      const review = reviewService.createReview(propertyId, userId, data);
      res.status(201).json({ review });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create review";
      const status = message.includes("already") || message.includes("must be") ? 400 : 500;
      res.status(status).json({ error: message });
    }
  }

  deleteReview(req: AuthRequest, res: Response): void {
    const id = parseInt(req.params.reviewId || req.params.id, 10);
    const userId = req.userId!;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid review ID" });
      return;
    }

    try {
      const success = reviewService.deleteReview(id, userId);
      if (!success) {
        res.status(404).json({ error: "Review not found or unauthorized" });
        return;
      }
      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ error: "Failed to delete review" });
    }
  }
}

export const reviewController = new ReviewController();
