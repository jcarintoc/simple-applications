import type { Request, Response } from "express";
import { authService, type AuthResult, type TokenPair } from "../services/auth.service.js";
import { userRepository } from "../repositories/index.js";
import { config } from "../config/index.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { clearCsrfTokens } from "../middleware/csrf.middleware.js";

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: "Email, password, and name are required" });
      return;
    }

    try {
      const result = await authService.register({ email, password, name });
      this.sendAuthResponse(res, result, 201, "User created successfully");
    } catch (error) {
      this.handleAuthError(res, error, "Registration failed");
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    try {
      const result = await authService.login({ email, password });
      this.sendAuthResponse(res, result, 200, "Login successful");
    } catch (error) {
      this.handleAuthError(res, error, "Login failed");
    }
  }

  refresh(req: Request, res: Response): void {
    const refreshToken = req.cookies?.[config.cookies.refresh.name];

    if (!refreshToken) {
      res.status(401).json({ error: "No refresh token" });
      return;
    }

    try {
      const tokens = authService.refreshTokens(refreshToken);
      this.setTokenCookies(res, tokens);
      res.json({ message: "Tokens refreshed" });
    } catch {
      this.clearTokenCookies(res);
      res.status(401).json({ error: "Invalid refresh token" });
    }
  }

  logout(req: AuthRequest, res: Response): void {
    if (req.userId) {
      clearCsrfTokens(String(req.userId));
    }
    this.clearTokenCookies(res);
    res.json({ message: "Logged out successfully" });
  }

  me(req: AuthRequest, res: Response): void {
    const user = userRepository.findById(req.userId!);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      user: { id: user.id, email: user.email, name: user.name },
    });
  }

  private sendAuthResponse(res: Response, result: AuthResult, status: number, message: string): void {
    this.setTokenCookies(res, result.tokens);
    res.status(status).json({ message, user: result.user });
  }

  private setTokenCookies(res: Response, tokens: TokenPair): void {
    res.cookie(config.cookies.access.name, tokens.accessToken, config.cookies.access.options);
    res.cookie(config.cookies.refresh.name, tokens.refreshToken, config.cookies.refresh.options);
  }

  private clearTokenCookies(res: Response): void {
    res.clearCookie(config.cookies.access.name, config.cookies.access.options);
    res.clearCookie(config.cookies.refresh.name, config.cookies.refresh.options);
  }

  private handleAuthError(res: Response, error: unknown, fallbackMessage: string): void {
    const message = error instanceof Error ? error.message : fallbackMessage;
    const knownErrors: Record<string, number> = {
      "Email already registered": 400,
      "Invalid credentials": 401,
    };

    if (knownErrors[message]) {
      res.status(knownErrors[message]).json({ error: message });
      return;
    }

    console.error(`${fallbackMessage}:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const authController = new AuthController();
