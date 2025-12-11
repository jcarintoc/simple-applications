import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { userRepository } from "../repositories/index.js";
import { config } from "../config/index.js";
import type { CreateUserDto, LoginDto, UserResponse, AuthPayload } from "../types/index.js";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  tokens: TokenPair;
  user: UserResponse;
}

export class AuthService {
  async register(data: CreateUserDto): Promise<AuthResult> {
    if (userRepository.emailExists(data.email)) {
      throw new Error("Email already registered");
    }

    if (userRepository.usernameExists(data.username)) {
      throw new Error("Username already taken");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userId = userRepository.create({
      ...data,
      password: hashedPassword,
    });

    const tokens = this.generateTokens(userId);
    const user = this.toUserResponse({ id: userId, email: data.email, name: data.name, username: data.username });

    return { tokens, user };
  }

  async login(data: LoginDto): Promise<AuthResult> {
    const user = userRepository.findByEmail(data.email);

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new Error("Invalid credentials");
    }

    const tokens = this.generateTokens(user.id);
    return { tokens, user: this.toUserResponse(user) };
  }

  refreshTokens(refreshToken: string): TokenPair {
    const payload = jwt.verify(refreshToken, config.jwt.refreshSecret) as AuthPayload;
    return this.generateTokens(payload.userId);
  }

  verifyAccessToken(token: string): AuthPayload {
    return jwt.verify(token, config.jwt.secret) as AuthPayload;
  }

  private generateTokens(userId: number): TokenPair {
    const payload: AuthPayload = { userId };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.accessExpiresIn,
    } as SignOptions);

    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    } as SignOptions);

    return { accessToken, refreshToken };
  }

  private toUserResponse(user: { id: number; email: string; name: string; username: string }): UserResponse {
    return { id: user.id, email: user.email, name: user.name, username: user.username };
  }
}

export const authService = new AuthService();
