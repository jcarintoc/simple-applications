import { Router } from "express";
import { postController } from "../controllers/post.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { csrfProtection } from "../middleware/csrf.middleware.js";
import { postCreationLimiter } from "../middleware/rate-limit.middleware.js";

const router = Router();

// Create post (auth + CSRF + rate limit)
router.post("/", authMiddleware, csrfProtection, postCreationLimiter, (req, res) =>
  postController.create(req, res)
);

// Get feed
router.get("/", (req, res) => postController.getFeed(req, res));

// Get single post
router.get("/:id", (req, res) => postController.getById(req, res));

// Delete post (auth + CSRF)
router.delete("/:id", authMiddleware, csrfProtection, (req, res) =>
  postController.delete(req, res)
);

export default router;
