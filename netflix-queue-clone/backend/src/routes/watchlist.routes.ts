import { Router } from "express";
import { watchlistController } from "../controllers/index.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware.js";
import { csrfProtectionMiddleware } from "../middleware/csrf.middleware.js";

const router = Router();

// All watchlist routes require authentication
router.use(authMiddleware);

router.get("/", (req, res) => watchlistController.getWatchlist(req as AuthRequest, res));
router.post("/:titleId", csrfProtectionMiddleware, (req, res) => watchlistController.toggleWatchlist(req as AuthRequest, res));
router.post("/:titleId/add", csrfProtectionMiddleware, (req, res) => watchlistController.addToWatchlist(req as AuthRequest, res));
router.delete("/:titleId", csrfProtectionMiddleware, (req, res) => watchlistController.removeFromWatchlist(req as AuthRequest, res));

export default router;
