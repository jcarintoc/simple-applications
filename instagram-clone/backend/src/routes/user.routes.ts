import { Router } from "express";
import { postController } from "../controllers/index.js";
import { followController } from "../controllers/index.js";
import { storyController } from "../controllers/index.js";
import { userController } from "../controllers/index.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import followRoutes from "./follow.routes.js";
import { userStoryRouter } from "./story.routes.js";

const router = Router();

// Search users (must be before /:userId routes)
router.get("/search", (req, res) => userController.search(req, res));

// User posts
router.get("/:userId/posts", (req, res) => postController.getByUser(req, res));

// User follow routes - following and followers (must be before /:userId/follow)
router.get("/:userId/following", (req, res) => followController.getFollowing(req, res));
router.get("/:userId/followers", (req, res) => followController.getFollowers(req, res));
router.get("/:userId/following/check", authMiddleware, (req, res) =>
  followController.checkFollowing(req as AuthRequest, res)
);

// User follow/unfollow routes (nested under /:userId/follow)
router.use("/:userId/follow", followRoutes);

// User stories
router.use("/:userId/stories", userStoryRouter);

export default router;
