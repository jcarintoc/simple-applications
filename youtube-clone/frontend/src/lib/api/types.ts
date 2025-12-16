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

// Types derived from schemas
export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

// Video schemas
export const videoSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  filename: z.string(),
  duration: z.number(),
  views: z.number(),
  created_at: z.string(),
  user_name: z.string(),
  user_email: z.string(),
  like_count: z.number(),
  comment_count: z.number(),
  is_liked: z.boolean().optional(),
});

export const videosResponseSchema = z.object({
  videos: z.array(videoSchema),
  total: z.number(),
  page: z.number(),
  totalPages: z.number(),
});

export const createVideoSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().max(5000, "Description too long").optional(),
});

export const updateVideoSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(5000).optional(),
});

// Video types
export type Video = z.infer<typeof videoSchema>;
export type VideosResponse = z.infer<typeof videosResponseSchema>;
export type CreateVideoInput = z.infer<typeof createVideoSchema>;
export type UpdateVideoInput = z.infer<typeof updateVideoSchema>;

// Comment schemas
export const commentSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  video_id: z.number(),
  content: z.string(),
  created_at: z.string(),
  user_name: z.string(),
  user_email: z.string(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment is required").max(1000, "Comment too long"),
});

export type Comment = z.infer<typeof commentSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;

// Playlist schemas
export const playlistSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  is_public: z.number(),
  created_at: z.string(),
  video_count: z.number(),
  user_name: z.string(),
});

export const createPlaylistSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
  is_public: z.boolean().default(true),
});

export const updatePlaylistSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  is_public: z.boolean().optional(),
});

export type Playlist = z.infer<typeof playlistSchema>;
export type CreatePlaylistInput = z.infer<typeof createPlaylistSchema>;
export type UpdatePlaylistInput = z.infer<typeof updatePlaylistSchema>;
