import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";

const CSRF_TOKEN_LENGTH = 32;
const csrfTokens = new Map<string, Set<string>>();

declare module "express" {
  interface Request {
    csrfToken?: () => string;
  }
}

export type CsrfRequest = Request;

// Generate a CSRF token
export function generateCsrfToken(userId: string): string {
  const token = crypto.randomBytes(CSRF_TOKEN_LENGTH).toString("hex");

  if (!csrfTokens.has(userId)) {
    csrfTokens.set(userId, new Set());
  }

  const userTokens = csrfTokens.get(userId)!;
  userTokens.add(token);

  // Limit tokens per user to prevent memory issues
  if (userTokens.size > 10) {
    const firstToken = userTokens.values().next().value as string;
    userTokens.delete(firstToken);
  }

  return token;
}

// Verify CSRF token
export function verifyCsrfToken(userId: string, token: string): boolean {
  const userTokens = csrfTokens.get(userId);
  if (!userTokens) return false;

  const isValid = userTokens.has(token);
  if (isValid) {
    userTokens.delete(token); // One-time use
  }

  return isValid;
}

// Clear all tokens for a user (on logout)
export function clearCsrfTokens(userId: string): void {
  csrfTokens.delete(userId);
}

// Middleware to add CSRF token to response
export function csrfTokenMiddleware(req: CsrfRequest, res: Response, next: NextFunction): void {
  const userId = (req as { userId?: number }).userId;

  if (userId) {
    req.csrfToken = () => {
      const token = generateCsrfToken(String(userId));
      res.setHeader("X-CSRF-Token", token);
      return token;
    };
  }

  next();
}

// Middleware to verify CSRF token
export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  // Only check CSRF on state-changing methods
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  const userId = (req as { userId?: number }).userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const token = req.headers["x-csrf-token"] as string;

  if (!token) {
    res.status(403).json({ error: "CSRF token missing" });
    return;
  }

  if (!verifyCsrfToken(String(userId), token)) {
    res.status(403).json({ error: "Invalid CSRF token" });
    return;
  }

  next();
}
