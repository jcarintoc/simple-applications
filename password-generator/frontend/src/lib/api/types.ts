import { z } from "zod";

// Zod Schemas
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});

export const authResponseSchema = z.object({
  message: z.string(),
  user: userSchema,
});

export const userResponseSchema = z.object({
  user: userSchema,
});

export const errorResponseSchema = z.object({
  error: z.string(),
});

// Password Generator Schemas
export const generatePasswordSchema = z.object({
  length: z.number().min(4).max(128),
  hasUppercase: z.boolean(),
  hasLowercase: z.boolean(),
  hasNumbers: z.boolean(),
  hasSymbols: z.boolean(),
}).refine(
  (data) => data.hasUppercase || data.hasLowercase || data.hasNumbers || data.hasSymbols,
  { message: "At least one character type must be selected" }
);

export const savePasswordSchema = z.object({
  password: z.string().min(1, "Password is required"),
  label: z.string().max(100).optional(),
  length: z.number().min(4).max(128),
  hasUppercase: z.boolean(),
  hasLowercase: z.boolean(),
  hasNumbers: z.boolean(),
  hasSymbols: z.boolean(),
});

export const savedPasswordSchema = z.object({
  id: z.number(),
  password: z.string(),
  label: z.string().nullable(),
  length: z.number(),
  hasUppercase: z.boolean(),
  hasLowercase: z.boolean(),
  hasNumbers: z.boolean(),
  hasSymbols: z.boolean(),
  createdAt: z.string(),
});

// Types derived from schemas
export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

// Password Generator Types
export type GeneratePasswordInput = z.infer<typeof generatePasswordSchema>;
export type SavePasswordInput = z.infer<typeof savePasswordSchema>;
export type SavedPassword = z.infer<typeof savedPasswordSchema>;
