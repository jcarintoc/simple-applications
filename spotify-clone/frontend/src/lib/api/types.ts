import { z } from "zod";

// Zod Schemas - Auth
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

// Zod Schemas - Songs
export const songSchema = z.object({
  id: z.number(),
  title: z.string(),
  artist: z.string(),
  album: z.string().nullable(),
  duration_seconds: z.number(),
  cover_url: z.string().nullable(),
  created_at: z.string(),
  is_liked: z.boolean(),
});

export const songsResponseSchema = z.object({
  songs: z.array(songSchema),
});

// Zod Schemas - Playlists
export const playlistSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  user_id: z.number(),
  created_at: z.string(),
});

export const playlistWithSongsSchema = playlistSchema.extend({
  songs: z.array(songSchema),
  song_count: z.number(),
});

export const playlistsResponseSchema = z.object({
  playlists: z.array(playlistSchema),
});

export const playlistResponseSchema = z.object({
  playlist: playlistWithSongsSchema,
});

export const createPlaylistSchema = z.object({
  name: z.string().min(1, "Playlist name is required"),
  description: z.string().optional(),
});

// Zod Schemas - Likes
export const toggleLikeResponseSchema = z.object({
  message: z.string(),
  is_liked: z.boolean(),
});

// Types derived from schemas
export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export type Song = z.infer<typeof songSchema>;
export type SongsResponse = z.infer<typeof songsResponseSchema>;

export type Playlist = z.infer<typeof playlistSchema>;
export type PlaylistWithSongs = z.infer<typeof playlistWithSongsSchema>;
export type PlaylistsResponse = z.infer<typeof playlistsResponseSchema>;
export type PlaylistResponse = z.infer<typeof playlistResponseSchema>;
export type CreatePlaylistInput = z.infer<typeof createPlaylistSchema>;

export type ToggleLikeResponse = z.infer<typeof toggleLikeResponseSchema>;
