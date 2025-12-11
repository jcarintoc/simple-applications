import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import type { AuthRequest } from "./auth.middleware.js";

const CSRF_SECRET = process.env.CSRF_SECRET || config.jwt.secret + "-csrf";

export interface CSRFRequest extends AuthRequest {
  csrfToken?: string;
}

export function generateCSRFToken(userId: number): string {
  return jwt.sign({ userId, type: "csrf" }, CSRF_SECRET, { expiresIn: "1h" });
}

export function verifyCSRFToken(token: string, userId: number): boolean {
  try {
    const payload = jwt.verify(token, CSRF_SECRET) as { userId: number; type: string };
    return payload.userId === userId && payload.type === "csrf";
  } catch {
    return false;
  }
}

export function csrfMiddleware(
  req: CSRFRequest,
  res: Response,
  next: NextFunction
): void {
  // Only protect state-changing methods
  if (req.method === "GET" || req.method === "OPTIONS") {
    next();
    return;
  }

  const token = req.headers["x-csrf-token"] as string | undefined;
  const userId = req.userId;

  if (!token || !userId) {
    res.status(403).json({ error: "CSRF token required" });
    return;
  }

  if (!verifyCSRFToken(token, userId)) {
    res.status(403).json({ error: "Invalid CSRF token" });
    return;
  }

  next();
}

