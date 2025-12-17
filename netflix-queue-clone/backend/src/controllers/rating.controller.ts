import type { Response } from "express";
import { ratingService } from "../services/index.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export class RatingController {
  rateTitle(req: AuthRequest, res: Response): void {
    const titleId = parseInt(req.params.titleId);
    if (isNaN(titleId)) {
      res.status(400).json({ error: "Invalid title ID" });
      return;
    }

    const { rating } = req.body;
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      res.status(400).json({ error: "Rating must be a number between 1 and 5" });
      return;
    }

    const result = ratingService.rateTitle(req.userId!, titleId, rating);
    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.json({
      message: "Rating saved",
      rating: result.rating?.rating,
      avg_rating: result.avg_rating,
    });
  }

  removeRating(req: AuthRequest, res: Response): void {
    const titleId = parseInt(req.params.titleId);
    if (isNaN(titleId)) {
      res.status(400).json({ error: "Invalid title ID" });
      return;
    }

    const result = ratingService.removeRating(req.userId!, titleId);
    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.json({ message: "Rating removed" });
  }
}

export const ratingController = new RatingController();
