import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware.js";

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

router.get("/search", (req, res) => userController.search(req as AuthRequest, res));

export default router;