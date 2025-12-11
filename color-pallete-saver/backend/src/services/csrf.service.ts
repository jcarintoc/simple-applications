import crypto from "crypto";
import { csrfRepository } from "../repositories/index.js";

const CSRF_TOKEN_EXPIRY_MINUTES = 30;

export class CsrfService {
  generateToken(userId: number): string {
    // Clean up expired tokens periodically
    csrfRepository.deleteExpired();

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + CSRF_TOKEN_EXPIRY_MINUTES * 60 * 1000);

    csrfRepository.create(userId, token, expiresAt);

    return token;
  }

  validateToken(userId: number, token: string): boolean {
    if (!token) return false;

    const validToken = csrfRepository.findValidToken(userId, token);
    if (!validToken) return false;

    // Delete the token after use (single-use tokens)
    csrfRepository.deleteByToken(token);

    return true;
  }

  invalidateUserTokens(userId: number): void {
    csrfRepository.deleteByUserId(userId);
  }
}

export const csrfService = new CsrfService();

