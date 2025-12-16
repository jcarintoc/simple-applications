import { Router } from "express";
import { commentController } from "../controllers/index.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.get("/:id", (req, res) => commentController.getById(req, res));

// Protected routes
// More specific routes first
router.post("/:id/upvote", authMiddleware, verifyCsrfToken, (req, res) =>
  commentController.upvote(req as AuthRequest, res)
);
router.put("/:id", authMiddleware, verifyCsrfToken, (req, res) =>
  commentController.update(req as AuthRequest, res)
);
router.delete("/:id", authMiddleware, verifyCsrfToken, (req, res) =>
  commentController.delete(req as AuthRequest, res)
);

export default router;
