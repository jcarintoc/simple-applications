import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";

const CSRF_TOKEN_NAME = "XSRF-TOKEN";
const CSRF_HEADER_NAME = "X-XSRF-TOKEN";

export interface CsrfRequest extends Request {
  csrfToken?: string;
}

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function setCsrfToken(req: CsrfRequest, res: Response, next: NextFunction): void {
  let token = req.cookies?.[CSRF_TOKEN_NAME];

  if (!token) {
    token = generateCsrfToken();
  }

  res.cookie(CSRF_TOKEN_NAME, token, {
    httpOnly: false, // Must be false for frontend to read
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  req.csrfToken = token;
  next();
}

export function verifyCsrfToken(req: Request, res: Response, next: NextFunction): void {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    next();
    return;
  }

  const tokenFromCookie = req.cookies?.[CSRF_TOKEN_NAME];
  const tokenFromHeader = req.headers[CSRF_HEADER_NAME.toLowerCase()] as string;

  if (!tokenFromCookie || !tokenFromHeader) {
    res.status(403).json({ error: "CSRF token missing" });
    return;
  }

  if (!crypto.timingSafeEqual(Buffer.from(tokenFromCookie), Buffer.from(tokenFromHeader))) {
    res.status(403).json({ error: "Invalid CSRF token" });
    return;
  }

  next();
}
