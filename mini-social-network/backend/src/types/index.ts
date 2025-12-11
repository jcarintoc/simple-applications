import { z } from "zod";

// User types
export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  username: string;
  created_at: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  username: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  username: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthPayload {
  userId: number;
}

// Validation schemas
export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const createPostSchema = z.object({
  content: z.string()
    .min(1, "Post content is required")
    .max(1000, "Post content must be at most 1000 characters"),
});

export const createCommentSchema = z.object({
  content: z.string()
    .min(1, "Comment content is required")
    .max(500, "Comment content must be at most 500 characters"),
});
