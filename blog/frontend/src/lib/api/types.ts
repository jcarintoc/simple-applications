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

export const postSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  slug: z.string(),
  author_id: z.number(),
  published: z.union([z.boolean(), z.number()]).transform(val => Boolean(val)),
  created_at: z.string(),
  updated_at: z.string(),
});

export const postWithAuthorSchema = postSchema.extend({
  author_name: z.string(),
  author_email: z.string(),
});

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  published: z.boolean().optional(),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  published: z.boolean().optional(),
});

export const commentSchema = z.object({
  id: z.number(),
  post_id: z.number(),
  author_id: z.number(),
  content: z.string(),
  created_at: z.string(),
});

export const commentWithAuthorSchema = commentSchema.extend({
  author_name: z.string(),
  author_email: z.string(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
});

export const csrfTokenResponseSchema = z.object({
  token: z.string(),
});

// Types derived from schemas
export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type Post = z.infer<typeof postSchema>;
export type PostWithAuthor = z.infer<typeof postWithAuthorSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type Comment = z.infer<typeof commentSchema>;
export type CommentWithAuthor = z.infer<typeof commentWithAuthorSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type CsrfTokenResponse = z.infer<typeof csrfTokenResponseSchema>;
