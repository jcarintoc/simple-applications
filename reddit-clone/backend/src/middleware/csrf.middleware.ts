import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { config } from "../config/index.js";

const CSRF_TOKEN_NAME = "XSRF-TOKEN";
const CSRF_HEADER_NAME = "X-XSRF-TOKEN";

export interface CsrfRequest extends Request {
  csrfToken?: string;
}

/**
 * Generate a CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Middleware to set CSRF token cookie
 * Should be used on routes that render forms or SPAs
 */
export function setCsrfToken(req: CsrfRequest, res: Response, next: NextFunction): void {
  // Check if token already exists in cookies
  let token = req.cookies?.[CSRF_TOKEN_NAME];

  // Generate new token if not exists
  if (!token) {
    token = generateCsrfToken();
  }

  // Set token in cookie (accessible by JavaScript for reading)
  res.cookie(CSRF_TOKEN_NAME, token, {
    httpOnly: false, // Must be false so frontend can read it
    secure: config.cors.origin !== "http://localhost:5173",
    sameSite: "strict",
    path: "/",
  });

  req.csrfToken = token;
  next();
}

/**
 * Middleware to verify CSRF token
 * Should be used on state-changing routes (POST, PUT, DELETE, PATCH)
 */
export function verifyCsrfToken(req: Request, res: Response, next: NextFunction): void {
  // Skip CSRF check for safe methods
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    next();
    return;
  }

  const tokenFromCookie = req.cookies?.[CSRF_TOKEN_NAME];
  const tokenFromHeader = req.headers[CSRF_HEADER_NAME.toLowerCase()] as string;

  // Check if both tokens exist
  if (!tokenFromCookie || !tokenFromHeader) {
    res.status(403).json({ error: "CSRF token missing" });
    return;
  }

  // Compare tokens (timing-safe comparison)
  if (!crypto.timingSafeEqual(Buffer.from(tokenFromCookie), Buffer.from(tokenFromHeader))) {
    res.status(403).json({ error: "Invalid CSRF token" });
    return;
  }

  next();
}

