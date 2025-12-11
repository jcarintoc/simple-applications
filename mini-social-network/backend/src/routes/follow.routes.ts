import { Router } from "express";
import { followController } from "../controllers/follow.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { csrfProtection } from "../middleware/csrf.middleware.js";
import { followLimiter } from "../middleware/rate-limit.middleware.js";

const router = Router();

// Follow user (auth + CSRF + rate limit)
router.post("/:userId/follow", authMiddleware, csrfProtection, followLimiter, (req, res) =>
  followController.follow(req, res)
);

// Unfollow user (auth + CSRF + rate limit)
router.delete("/:userId/follow", authMiddleware, csrfProtection, followLimiter, (req, res) =>
  followController.unfollow(req, res)
);

// Get user's followers
router.get("/:userId/followers", (req, res) => followController.getFollowers(req, res));

// Get users followed by user
router.get("/:userId/following", (req, res) => followController.getFollowing(req, res));

// Check if current user follows another user (auth required)
router.get("/:userId/following/check", authMiddleware, (req, res) =>
  followController.checkFollowing(req, res)
);

export default router;
