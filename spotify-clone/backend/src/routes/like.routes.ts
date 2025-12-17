import { Router } from "express";
import { likeController } from "../controllers/index.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware.js";
import { csrfProtectionMiddleware } from "../middleware/csrf.middleware.js";

const router = Router();

// All like routes require authentication
router.use(authMiddleware);

// GET routes (no CSRF needed)
router.get("/", (req, res) => likeController.getLikedSongs(req as AuthRequest, res));

// Mutating routes with CSRF protection
router.post("/:songId", csrfProtectionMiddleware, (req, res) => likeController.toggleLike(req as AuthRequest, res));
router.post("/:songId/like", csrfProtectionMiddleware, (req, res) => likeController.likeSong(req as AuthRequest, res));
router.delete("/:songId/like", csrfProtectionMiddleware, (req, res) => likeController.unlikeSong(req as AuthRequest, res));

export default router;
