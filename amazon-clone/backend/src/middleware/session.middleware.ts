import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { config } from "../config/index.js";

const SESSION_COOKIE_NAME = "session_id";

export interface SessionRequest extends Request {
  sessionId?: string;
}

/**
 * Middleware to set session ID cookie for cart tracking
 * Works for both anonymous and authenticated users
 */
export function setSessionId(req: SessionRequest, res: Response, next: NextFunction): void {
  // Check if session ID already exists in cookies
  let sessionId = req.cookies?.[SESSION_COOKIE_NAME];

  // Generate new session ID if not exists
  if (!sessionId) {
    sessionId = crypto.randomBytes(16).toString("hex");
  }

  // Set session ID in cookie
  res.cookie(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: config.cors.origin !== "http://localhost:5173",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: "/",
  });

  req.sessionId = sessionId;
  next();
}