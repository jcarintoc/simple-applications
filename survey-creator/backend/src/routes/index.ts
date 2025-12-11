import { Router } from "express";
import authRoutes from "./auth.routes.js";
import surveyRoutes from "./survey.routes.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware.js";
import { generateCSRFToken } from "../middleware/csrf.middleware.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/surveys", surveyRoutes);

// CSRF token endpoint - requires authentication
router.get("/csrf-token", authMiddleware, (req, res) => {
  const userId = (req as AuthRequest).userId!;
  const token = generateCSRFToken(userId);
  res.json({ csrfToken: token });
});

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;
