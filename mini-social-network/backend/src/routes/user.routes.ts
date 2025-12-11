import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { postController } from "../controllers/post.controller.js";
import { optionalAuthMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// Get user profile
router.get("/:userId", (req, res) => userController.getProfile(req, res));

// Get user's posts (optional auth to show like state)
router.get("/:userId/posts", optionalAuthMiddleware, (req, res) => postController.getUserPosts(req, res));

export default router;
