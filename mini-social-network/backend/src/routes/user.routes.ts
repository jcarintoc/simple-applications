import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { postController } from "../controllers/post.controller.js";

const router = Router();

// Get user profile
router.get("/:userId", (req, res) => userController.getProfile(req, res));

// Get user's posts
router.get("/:userId/posts", (req, res) => postController.getUserPosts(req, res));

export default router;
