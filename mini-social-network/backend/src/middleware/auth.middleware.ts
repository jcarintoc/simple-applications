import type { Request, Response, NextFunction } from "express";
import { authService } from "../services/index.js";
import { config } from "../config/index.js";

export interface AuthRequest extends Request {
  userId?: number;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const accessToken = req.cookies?.[config.cookies.access.name];

  if (!accessToken) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  try {
    const payload = authService.verifyAccessToken(accessToken);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: "Token expired" });
  }
}

// Optional auth middleware - doesn't fail if not authenticated, just sets userId if available
export function optionalAuthMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void {
  const accessToken = req.cookies?.[config.cookies.access.name];

  if (accessToken) {
    try {
      const payload = authService.verifyAccessToken(accessToken);
      req.userId = payload.userId;
    } catch {
      // Token expired or invalid, but we don't fail the request
      req.userId = undefined;
    }
  }

  next();
}
