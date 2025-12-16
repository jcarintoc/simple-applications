import { Router } from "express";
import { authController } from "../controllers/index.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));
router.post("/refresh", (req, res) => authController.refresh(req, res));
router.post("/logout", (req, res) => authController.logout(req, res));
router.get("/me", authMiddleware, (req, res) => authController.me(req as AuthRequest, res));

export default router;
