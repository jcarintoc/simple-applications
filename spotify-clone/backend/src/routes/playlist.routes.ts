import { Router } from "express";
import { playlistController } from "../controllers/index.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware.js";
import { csrfProtectionMiddleware } from "../middleware/csrf.middleware.js";

const router = Router();

// All playlist routes require authentication
router.use(authMiddleware);

// GET routes (no CSRF needed)
router.get("/", (req, res) => playlistController.getAll(req as AuthRequest, res));
router.get("/:id", (req, res) => playlistController.getById(req as AuthRequest, res));

// Mutating routes with CSRF protection
router.post("/", csrfProtectionMiddleware, (req, res) => playlistController.create(req as AuthRequest, res));
router.put("/:id", csrfProtectionMiddleware, (req, res) => playlistController.update(req as AuthRequest, res));
router.delete("/:id", csrfProtectionMiddleware, (req, res) => playlistController.delete(req as AuthRequest, res));

// Playlist songs management
router.post("/:id/songs/:songId", csrfProtectionMiddleware, (req, res) => playlistController.addSong(req as AuthRequest, res));
router.delete("/:id/songs/:songId", csrfProtectionMiddleware, (req, res) => playlistController.removeSong(req as AuthRequest, res));

export default router;
