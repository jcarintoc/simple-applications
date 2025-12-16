import { Router } from "express";
import { postController } from "../controllers/index.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import commentRoutes from "./comment.routes.js";

const router = Router();

// Nested comment routes (must be before /:id route)
router.use("/:postId/comments", commentRoutes);

// Public routes
router.get("/", (req, res) => postController.getAll(req, res));
router.get("/:id", (req, res) => postController.getById(req, res));

// Protected routes
router.post("/", authMiddleware, verifyCsrfToken, (req, res) =>
  postController.create(req as AuthRequest, res)
);
router.put("/:id", authMiddleware, verifyCsrfToken, (req, res) =>
  postController.update(req as AuthRequest, res)
);
router.delete("/:id", authMiddleware, verifyCsrfToken, (req, res) =>
  postController.delete(req as AuthRequest, res)
);
router.post("/:id/upvote", authMiddleware, verifyCsrfToken, (req, res) =>
  postController.upvote(req as AuthRequest, res)
);

export default router;

