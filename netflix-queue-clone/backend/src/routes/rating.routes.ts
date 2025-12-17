import { Router } from "express";
import { ratingController } from "../controllers/index.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware.js";
import { csrfProtectionMiddleware } from "../middleware/csrf.middleware.js";

const router = Router();

// All rating routes require authentication
router.use(authMiddleware);

router.post("/:titleId", csrfProtectionMiddleware, (req, res) => ratingController.rateTitle(req as AuthRequest, res));
router.delete("/:titleId", csrfProtectionMiddleware, (req, res) => ratingController.removeRating(req as AuthRequest, res));

export default router;
