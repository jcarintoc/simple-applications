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

export const favoriteCategorySchema = z.enum(["Movie", "Song", "Book", "Game", "Show", "Other"]);

export const favoriteSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: favoriteCategorySchema,
  created_at: z.string(),
});

export const createFavoriteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: favoriteCategorySchema,
});

export const updateFavoriteSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  category: favoriteCategorySchema.optional(),
}).refine((data) => data.name !== undefined || data.category !== undefined, {
  message: "At least one field (name or category) must be provided",
});

export const favoritesResponseSchema = z.object({
  favorites: z.array(favoriteSchema),
});

export const favoriteResponseSchema = z.object({
  favorite: favoriteSchema,
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
export type Favorite = z.infer<typeof favoriteSchema>;
export type FavoriteCategory = z.infer<typeof favoriteCategorySchema>;
export type CreateFavoriteInput = z.infer<typeof createFavoriteSchema>;
export type UpdateFavoriteInput = z.infer<typeof updateFavoriteSchema>;
export type FavoritesResponse = z.infer<typeof favoritesResponseSchema>;
export type FavoriteResponse = z.infer<typeof favoriteResponseSchema>;
export type CSRFTokenResponse = z.infer<typeof csrfTokenResponseSchema>;
