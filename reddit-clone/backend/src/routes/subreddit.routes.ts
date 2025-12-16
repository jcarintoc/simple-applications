import { Router } from "express";
import { subredditController } from "../controllers/index.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.get("/", (req, res) => subredditController.getAll(req, res));
router.get("/:id", (req, res) => subredditController.getById(req, res));

// Protected routes
router.post("/", authMiddleware, verifyCsrfToken, (req, res) =>
  subredditController.create(req as AuthRequest, res)
);
router.put("/:id", authMiddleware, verifyCsrfToken, (req, res) =>
  subredditController.update(req as AuthRequest, res)
);
router.delete("/:id", authMiddleware, verifyCsrfToken, (req, res) =>
  subredditController.delete(req as AuthRequest, res)
);

export default router;

