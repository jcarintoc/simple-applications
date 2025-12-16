import { Router } from "express";
import { emailController } from "../controllers/email.controller.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";

const router = Router();

// All email routes require authentication
router.use(authMiddleware);

// GET routes (no CSRF)
router.get("/", (req, res) => emailController.getEmails(req as AuthRequest, res));
router.get("/unread-count", (req, res) => emailController.getUnreadCount(req as AuthRequest, res));
router.get("/:id", (req, res) => emailController.getEmailById(req as AuthRequest, res));

// All mutations require CSRF
router.post("/", verifyCsrfToken, (req, res) => emailController.sendEmail(req as AuthRequest, res));
router.patch("/:id/read", verifyCsrfToken, (req, res) => emailController.markAsRead(req as AuthRequest, res));
router.patch("/:id/unread", verifyCsrfToken, (req, res) => emailController.markAsUnread(req as AuthRequest, res));
router.patch("/:id/archive", verifyCsrfToken, (req, res) => emailController.archive(req as AuthRequest, res));
router.patch("/:id/unarchive", verifyCsrfToken, (req, res) => emailController.unarchive(req as AuthRequest, res));
router.delete("/:id", verifyCsrfToken, (req, res) => emailController.deleteEmail(req as AuthRequest, res));
router.patch("/:id/restore", verifyCsrfToken, (req, res) => emailController.restore(req as AuthRequest, res));
router.delete("/:id/permanent", verifyCsrfToken, (req, res) => emailController.permanentDelete(req as AuthRequest, res));

export default router;