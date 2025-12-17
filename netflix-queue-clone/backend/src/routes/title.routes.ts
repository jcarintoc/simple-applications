import { Router } from "express";
import type { Response, NextFunction } from "express";
import { titleController } from "../controllers/index.js";
import { type AuthRequest } from "../middleware/auth.middleware.js";
import { authService } from "../services/index.js";
import { config } from "../config/index.js";

const router = Router();

// Optional auth - extracts userId if authenticated, but doesn't block if not
function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  const accessToken = req.cookies?.[config.cookies.access.name];

  if (accessToken) {
    try {
      const payload = authService.verifyAccessToken(accessToken);
      req.userId = payload.userId;
    } catch {
      // Token invalid/expired - continue without auth
    }
  }

  next();
}

router.get("/", optionalAuth, (req, res) => titleController.getAll(req, res));
router.get("/search", optionalAuth, (req, res) => titleController.search(req, res));
router.get("/genres", (req, res) => titleController.getGenres(req, res));

export default router;
