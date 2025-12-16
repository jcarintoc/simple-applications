import { Router } from "express";
import { followController } from "../controllers/index.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

const router = Router({ mergeParams: true });

// Protected routes - nested under /users/:userId/follow
router.post("/", authMiddleware, verifyCsrfToken, (req, res) =>
  followController.follow(req as AuthRequest, res)
);
router.delete("/", authMiddleware, verifyCsrfToken, (req, res) =>
  followController.unfollow(req as AuthRequest, res)
);

export default router;
