import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { db } from "../db/database.js";

interface CsrfToken {
  id: number;
  token: string;
  user_id: number;
  expires_at: string;
  created_at: string;
}

const CSRF_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

export const generateCsrfToken = (userId: number): string => {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + CSRF_TOKEN_EXPIRY).toISOString();

  // Clean up expired tokens for this user
  db.prepare("DELETE FROM csrf_tokens WHERE user_id = ? AND expires_at < datetime('now')").run(userId);

  // Insert new token
  db.prepare("INSERT INTO csrf_tokens (token, user_id, expires_at) VALUES (?, ?, ?)").run(
    token,
    userId,
    expiresAt
  );

  return token;
};

export const validateCsrfToken = (token: string, userId: number): boolean => {
  const result = db
    .prepare<[string, number]>(
      "SELECT * FROM csrf_tokens WHERE token = ? AND user_id = ? AND expires_at > datetime('now')"
    )
    .get(token, userId) as CsrfToken | undefined;

  if (!result) {
    return false;
  }

  // Delete the token after use (one-time use)
  db.prepare("DELETE FROM csrf_tokens WHERE token = ?").run(token);

  return true;
};

export const csrfProtection = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as Request & { user?: { id: number } }).user;

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = req.headers["x-csrf-token"] as string;

  if (!token) {
    res.status(403).json({ error: "CSRF token missing" });
    return;
  }

  if (!validateCsrfToken(token, user.id)) {
    res.status(403).json({ error: "Invalid or expired CSRF token" });
    return;
  }

  next();
};
