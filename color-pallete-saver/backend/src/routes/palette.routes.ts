import { Router } from "express";
import { paletteController } from "../controllers/index.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware.js";

const router = Router();

// All palette routes require authentication
router.use(authMiddleware);

// Get CSRF token for delete operations
router.get("/csrf-token", (req, res) => paletteController.getCsrfToken(req as AuthRequest, res));

// CRUD operations
router.get("/", (req, res) => paletteController.getAll(req as AuthRequest, res));
router.get("/:id", (req, res) => paletteController.getOne(req as AuthRequest, res));
router.post("/", (req, res) => paletteController.create(req as AuthRequest, res));
router.put("/:id", (req, res) => paletteController.update(req as AuthRequest, res));
router.delete("/:id", (req, res) => paletteController.delete(req as AuthRequest, res));

export default router;

