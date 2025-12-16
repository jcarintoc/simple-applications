import { Router } from "express";
import { profileController } from "../controllers/profile.controller.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";

const router = Router();

router.get("/me", authMiddleware, (req, res) => profileController.getMyProfile(req as AuthRequest, res));
router.get("/suggested", authMiddleware, (req, res) => profileController.getSuggestedUsers(req as AuthRequest, res));
router.get("/:userId", authMiddleware, (req, res) => profileController.getProfile(req, res));
router.put("/me", authMiddleware, verifyCsrfToken, (req, res) => profileController.updateMyProfile(req as AuthRequest, res));

export default router;
