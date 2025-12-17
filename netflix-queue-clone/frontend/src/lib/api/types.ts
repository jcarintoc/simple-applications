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

// Title schemas
export const titleTypeSchema = z.enum(["movie", "show"]);

export const titleSchema = z.object({
  id: z.number(),
  title: z.string(),
  type: titleTypeSchema,
  description: z.string().nullable(),
  genre: z.string(),
  release_year: z.number(),
  duration_minutes: z.number().nullable(),
  seasons: z.number().nullable(),
  thumbnail_url: z.string().nullable(),
  created_at: z.string(),
});

export const titleWithUserDataSchema = titleSchema.extend({
  in_watchlist: z.boolean(),
  user_rating: z.number().nullable(),
  avg_rating: z.number().nullable(),
});

export const titlesResponseSchema = z.object({
  titles: z.array(titleWithUserDataSchema),
});

export const genresResponseSchema = z.object({
  genres: z.array(z.string()),
});

// Watchlist schemas
export const watchlistToggleResponseSchema = z.object({
  message: z.string(),
  in_watchlist: z.boolean(),
});

// Rating schemas
export const ratingInputSchema = z.object({
  rating: z.number().min(1).max(5),
});

export const ratingResponseSchema = z.object({
  message: z.string(),
  rating: z.number(),
  avg_rating: z.number().nullable(),
});

// Continue watching schemas
export const continueWatchingItemSchema = z.object({
  id: z.number(),
  session_id: z.string(),
  title_id: z.number(),
  progress_percent: z.number(),
  last_watched: z.string(),
  title: titleSchema,
});

export const continueWatchingResponseSchema = z.object({
  items: z.array(continueWatchingItemSchema),
});

export const progressInputSchema = z.object({
  progress_percent: z.number().min(0).max(100),
});

// Types derived from schemas
export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

// Title types
export type TitleType = z.infer<typeof titleTypeSchema>;
export type Title = z.infer<typeof titleSchema>;
export type TitleWithUserData = z.infer<typeof titleWithUserDataSchema>;
export type TitlesResponse = z.infer<typeof titlesResponseSchema>;
export type GenresResponse = z.infer<typeof genresResponseSchema>;

// Watchlist types
export type WatchlistToggleResponse = z.infer<typeof watchlistToggleResponseSchema>;

// Rating types
export type RatingInput = z.infer<typeof ratingInputSchema>;
export type RatingResponse = z.infer<typeof ratingResponseSchema>;

// Continue watching types
export type ContinueWatchingItem = z.infer<typeof continueWatchingItemSchema>;
export type ContinueWatchingResponse = z.infer<typeof continueWatchingResponseSchema>;
export type ProgressInput = z.infer<typeof progressInputSchema>;
