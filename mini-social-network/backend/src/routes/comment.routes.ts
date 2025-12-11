import { Router } from "express";
import { commentController } from "../controllers/comment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { csrfProtection } from "../middleware/csrf.middleware.js";
import { commentCreationLimiter } from "../middleware/rate-limit.middleware.js";

const router = Router();

// Create comment (auth + CSRF + rate limit)
router.post("/:postId/comments", authMiddleware, csrfProtection, commentCreationLimiter, (req, res) =>
  commentController.create(req, res)
);

// Get comments for a post
router.get("/:postId/comments", (req, res) => commentController.getPostComments(req, res));

// Delete comment (auth + CSRF)
router.delete("/:id", authMiddleware, csrfProtection, (req, res) =>
  commentController.delete(req, res)
);

export default router;
