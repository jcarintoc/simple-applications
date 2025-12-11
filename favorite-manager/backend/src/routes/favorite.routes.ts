import { Router } from "express";
import { favoriteController } from "../controllers/index.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware.js";
import { csrfMiddleware, type CSRFRequest } from "../middleware/csrf.middleware.js";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET doesn't need CSRF, POST, PUT, and DELETE do
router.get("/", (req, res) => favoriteController.getAll(req as CSRFRequest, res));
router.post("/", csrfMiddleware, (req, res) => favoriteController.create(req as CSRFRequest, res));
router.put("/:id", csrfMiddleware, (req, res) => favoriteController.update(req as CSRFRequest, res));
router.delete("/:id", csrfMiddleware, (req, res) => favoriteController.delete(req as CSRFRequest, res));

export default router;

