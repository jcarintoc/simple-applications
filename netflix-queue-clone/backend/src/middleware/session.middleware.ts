import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "session_id";

export interface SessionRequest extends Request {
  sessionId?: string;
}

export function sessionMiddleware(
  req: SessionRequest,
  res: Response,
  next: NextFunction
): void {
  let sessionId = req.cookies?.[SESSION_COOKIE_NAME];

  // Generate session ID if not present
  if (!sessionId) {
    sessionId = crypto.randomBytes(32).toString("hex");
    res.cookie(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  }

  req.sessionId = sessionId;
  next();
}
