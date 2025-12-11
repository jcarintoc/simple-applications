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

// Palette Schemas
const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

export const paletteSchema = z.object({
  id: z.number(),
  name: z.string(),
  colors: z.array(z.string().regex(hexColorRegex)),
  createdAt: z.string(),
});

export const createPaletteSchema = z.object({
  name: z.string().min(1, "Palette name is required").max(50, "Name must be 50 characters or less"),
  colors: z
    .array(z.string().regex(hexColorRegex, "Invalid hex color"))
    .min(1, "At least one color is required")
    .max(10, "Maximum 10 colors allowed"),
});

export const updatePaletteSchema = z.object({
  name: z.string().min(1, "Palette name is required").max(50, "Name must be 50 characters or less").optional(),
  colors: z
    .array(z.string().regex(hexColorRegex, "Invalid hex color"))
    .min(1, "At least one color is required")
    .max(10, "Maximum 10 colors allowed")
    .optional(),
});

export const palettesResponseSchema = z.object({
  palettes: z.array(paletteSchema),
});

export const paletteResponseSchema = z.object({
  palette: paletteSchema,
});

export const paletteCreatedResponseSchema = z.object({
  message: z.string(),
  palette: paletteSchema,
});

export const csrfTokenResponseSchema = z.object({
  csrfToken: z.string(),
});

// Types derived from schemas
export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

// Palette types
export type Palette = z.infer<typeof paletteSchema>;
export type CreatePaletteInput = z.infer<typeof createPaletteSchema>;
export type UpdatePaletteInput = z.infer<typeof updatePaletteSchema>;
export type PalettesResponse = z.infer<typeof palettesResponseSchema>;
export type PaletteResponse = z.infer<typeof paletteResponseSchema>;
export type PaletteCreatedResponse = z.infer<typeof paletteCreatedResponseSchema>;
export type CsrfTokenResponse = z.infer<typeof csrfTokenResponseSchema>;
