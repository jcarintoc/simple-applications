import { z } from "zod";

// User types
export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  created_at: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthPayload {
  userId: number;
}

// Video types
export interface Video {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  filename: string;
  duration: number;
  views: number;
  created_at: string;
}

export interface VideoWithUser extends Video {
  user_name: string;
  user_email: string;
  like_count: number;
  comment_count: number;
  is_liked?: boolean;
}

export interface CreateVideoDto {
  title: string;
  description?: string;
  filename: string;
}

export interface UpdateVideoDto {
  title?: string;
  description?: string;
}

// Comment types
export interface Comment {
  id: number;
  user_id: number;
  video_id: number;
  content: string;
  created_at: string;
}

export interface CommentWithUser extends Comment {
  user_name: string;
  user_email: string;
}

// Playlist types
export interface Playlist {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  is_public: number;
  created_at: string;
}

export interface PlaylistWithDetails extends Playlist {
  video_count: number;
  user_name: string;
}

export interface PlaylistVideo {
  id: number;
  playlist_id: number;
  video_id: number;
  position: number;
  added_at: string;
}

// Validation schemas
export const createVideoSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().max(5000, "Description too long").optional(),
});

export const updateVideoSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(5000).optional(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment is required").max(1000, "Comment too long"),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, "Comment is required").max(1000, "Comment too long"),
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

export const addVideoToPlaylistSchema = z.object({
  video_id: z.number().int().positive("Invalid video ID"),
});
