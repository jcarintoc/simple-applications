import { Router } from "express";
import { commentController } from "../controllers/index.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

const router = Router({ mergeParams: true });

// Public routes - nested under /posts/:postId/comments
router.get("/", (req, res) => {
  // Handle nested route: /posts/:postId/comments
  const postId = req.params.postId || req.params.id;
  req.params.postId = postId;
  commentController.getByPost(req, res);
});

// Protected routes - nested under /posts/:postId/comments
router.post("/", authMiddleware, verifyCsrfToken, (req, res) => {
  // Handle nested route: /posts/:postId/comments
  const postId = req.params.postId || req.params.id;
  req.params.postId = postId;
  commentController.create(req as AuthRequest, res);
});

export default router;

