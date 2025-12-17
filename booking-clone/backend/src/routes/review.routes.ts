import { Router } from "express";
import { reviewController } from "../controllers/index.js";
import {
  authMiddleware,
  type AuthRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

// Public route - get hotel reviews
router.get("/hotel/:hotelId", (req, res) =>
  reviewController.getHotelReviews(req, res)
);

// Protected routes
router.post("/", authMiddleware, (req, res) =>
  reviewController.create(req as AuthRequest, res)
);
router.delete("/:id", authMiddleware, (req, res) =>
  reviewController.delete(req as AuthRequest, res)
);

export default router;
