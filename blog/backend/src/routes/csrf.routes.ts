import { Router } from "express";
import { getCsrfToken } from "../controllers/csrf.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/token", authMiddleware, getCsrfToken);

export default router;
