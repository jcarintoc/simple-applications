import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";

// Simple CSRF token generation and validation
const csrfTokens = new Map<string, string>();

export function generateCsrfToken(req: Request, res: Response): string {
  const token = crypto.randomBytes(32).toString("hex");

  // Store token in cookie
  res.cookie("csrf-token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return token;
}

export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  // Skip GET, HEAD, OPTIONS
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    next();
    return;
  }

  const cookieToken = req.cookies["csrf-token"];
  const headerToken = req.headers["x-csrf-token"] as string;

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    res.status(403).json({ error: "Invalid CSRF token" });
    return;
  }

  next();
}
