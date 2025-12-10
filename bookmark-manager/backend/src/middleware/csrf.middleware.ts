import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import type { AuthRequest } from "./auth.middleware.js";

const csrfTokens = new Map<number, string>();

export const generateCsrfToken = (userId: number): string => {
  const token = crypto.randomBytes(32).toString("hex");
  csrfTokens.set(userId, token);
  return token;
};

export const validateCsrfToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const userId = req.userId;
  const token = req.headers["x-csrf-token"] as string;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const storedToken = csrfTokens.get(userId);

  if (!token || !storedToken || token !== storedToken) {
    res.status(403).json({ error: "Invalid CSRF token" });
    return;
  }

  next();
};

export const getCsrfToken = (req: AuthRequest, res: Response): void => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = generateCsrfToken(userId);
  res.json({ csrfToken: token });
};
