import type { Request, Response, NextFunction } from "express";
import { authService } from "../services/index.js";
import { config } from "../config/index.js";

export interface AuthRequest extends Request {
  user?: {
    id: number;
  };
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
    req.user = { id: payload.userId };
    next();
  } catch {
    res.status(401).json({ error: "Token expired" });
  }
}
