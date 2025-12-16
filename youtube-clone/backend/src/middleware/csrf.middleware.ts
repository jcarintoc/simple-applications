import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";

const CSRF_TOKEN_NAME = "XSRF-TOKEN";
const CSRF_HEADER_NAME = "x-xsrf-token";

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function setCsrfToken(req: Request, res: Response, next: NextFunction): void {
  let token = req.cookies?.[CSRF_TOKEN_NAME] as string | undefined;

  if (!token) {
    token = generateCsrfToken();
  }

  res.cookie(CSRF_TOKEN_NAME, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  next();
}

export function verifyCsrfToken(req: Request, res: Response, next: NextFunction): void {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    next();
    return;
  }

  const tokenFromCookie = req.cookies?.[CSRF_TOKEN_NAME] as string | undefined;
  const tokenFromHeader = req.headers[CSRF_HEADER_NAME] as string | undefined;

  if (!tokenFromCookie || !tokenFromHeader) {
    res.status(403).json({ error: "CSRF token missing" });
    return;
  }

  try {
    const cookieBuffer = Buffer.from(tokenFromCookie);
    const headerBuffer = Buffer.from(tokenFromHeader);

    if (cookieBuffer.length !== headerBuffer.length || !crypto.timingSafeEqual(cookieBuffer, headerBuffer)) {
      res.status(403).json({ error: "Invalid CSRF token" });
      return;
    }
  } catch {
    res.status(403).json({ error: "Invalid CSRF token" });
    return;
  }

  next();
}
