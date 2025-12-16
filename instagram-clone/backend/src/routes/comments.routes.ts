import { Router } from "express";
import { commentController } from "../controllers/index.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

const router = Router();

// Protected routes - standalone /comments/:id routes
router.put("/:id", authMiddleware, verifyCsrfToken, (req, res) =>
  commentController.update(req as AuthRequest, res)
);
router.delete("/:id", authMiddleware, verifyCsrfToken, (req, res) =>
  commentController.delete(req as AuthRequest, res)
);

export default router;
