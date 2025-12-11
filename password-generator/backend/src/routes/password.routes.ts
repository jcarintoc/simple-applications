import { Router } from "express";
import { passwordController } from "../controllers/index.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getCsrfToken, validateCsrfToken } from "../middleware/csrf.middleware.js";

const router = Router();

// Public route - generate password (no auth required)
router.post("/generate", (req, res) => passwordController.generate(req, res));

// Protected routes - require authentication
router.use(authMiddleware);

// Get CSRF token for delete operations
router.get("/csrf-token", getCsrfToken);

// Get saved passwords
router.get("/", (req, res) => passwordController.getSaved(req, res));

// Save a password
router.post("/", (req, res) => passwordController.save(req, res));

// Delete a password (requires CSRF token)
router.delete("/:id", validateCsrfToken, (req, res) => passwordController.delete(req, res));

// Delete all passwords (requires CSRF token)
router.delete("/", validateCsrfToken, (req, res) => passwordController.deleteAll(req, res));

export default router;

