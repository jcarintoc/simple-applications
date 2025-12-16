import type { CookieOptions } from "express";

const isProduction = process.env.NODE_ENV === "production";

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
};

// Parse duration string (e.g., "15m", "7d") to milliseconds
function parseExpiryToMs(expiry: string): number {
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) return 15 * 60 * 1000; // default 15 minutes

  const value = parseInt(match[1]);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * multipliers[unit];
}

const accessExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const refreshExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

export const config = {
  port: process.env.PORT || 3001,
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
    accessExpiresIn,
    refreshExpiresIn,
  },
  cookies: {
    access: {
      name: "accessToken",
      options: {
        ...baseCookieOptions,
        maxAge: parseExpiryToMs(accessExpiresIn),
      } as CookieOptions,
    },
    refresh: {
      name: "refreshToken",
      options: {
        ...baseCookieOptions,
        maxAge: parseExpiryToMs(refreshExpiresIn),
        path: "/api/auth",
      } as CookieOptions,
    },
  },
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
} as const;
