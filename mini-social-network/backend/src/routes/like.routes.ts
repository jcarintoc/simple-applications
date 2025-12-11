import { Router } from "express";
import { likeController } from "../controllers/like.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { csrfProtection } from "../middleware/csrf.middleware.js";
import { likeLimiter } from "../middleware/rate-limit.middleware.js";

const router = Router();

// Like post (auth + CSRF + rate limit)
router.post("/:postId/like", authMiddleware, csrfProtection, likeLimiter, (req, res) =>
  likeController.like(req, res)
);

// Unlike post (auth + CSRF + rate limit)
router.delete("/:postId/like", authMiddleware, csrfProtection, likeLimiter, (req, res) =>
  likeController.unlike(req, res)
);

// Get users who liked a post
router.get("/:postId/likes", (req, res) => likeController.getPostLikes(req, res));

export default router;
