import { Router } from "express";
import { reviewController } from "../controllers/review.controller.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";

const router = Router({ mergeParams: true }); // mergeParams to access propertyId from parent route

// Public route
router.get("/", (req, res) => reviewController.getReviewsByProperty(req, res));

// Protected routes
router.post("/", authMiddleware, verifyCsrfToken, (req, res) =>
  reviewController.createReview(req as AuthRequest, res)
);

router.delete("/:reviewId", authMiddleware, verifyCsrfToken, (req, res) =>
  reviewController.deleteReview(req as AuthRequest, res)
);

export default router;
