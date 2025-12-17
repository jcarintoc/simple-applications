import { Router } from "express";
import type { Response, NextFunction } from "express";
import { songController } from "../controllers/index.js";
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

router.get("/", optionalAuth, (req, res) => songController.getAll(req, res));
router.get("/search", optionalAuth, (req, res) => songController.search(req, res));
router.get("/:id", (req, res) => songController.getById(req, res));

export default router;
