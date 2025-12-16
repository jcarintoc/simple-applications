import { Router } from "express";
import { storyController } from "../controllers/index.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

const router = Router();

// Protected routes
router.get("/", authMiddleware, (req, res) => storyController.getActive(req as AuthRequest, res));

// Nested under /users/:userId/stories
const userStoryRouter = Router({ mergeParams: true });
userStoryRouter.get("/", authMiddleware, (req, res) => storyController.getByUser(req as AuthRequest, res));

export default router;
export { userStoryRouter };
