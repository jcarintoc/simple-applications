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

// Post schemas
export const postSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  image_url: z.string().url(),
  caption: z.string().nullable(),
  likes_count: z.number(),
  created_at: z.string(),
});

export const postWithAuthorSchema = postSchema.extend({
  author_name: z.string(),
  author_email: z.string(),
});

export const createPostInputSchema = z.object({
  image_url: z.string().url("Invalid image URL"),
  caption: z.string().max(2000, "Caption must be at most 2000 characters").nullable().optional(),
});

export const updatePostInputSchema = z.object({
  caption: z.string().max(2000).nullable().optional(),
});

export const postsResponseSchema = z.object({
  posts: z.array(postWithAuthorSchema),
});

export const postResponseSchema = z.object({
  post: postWithAuthorSchema,
});

export const likeResponseSchema = z.object({
  hasLiked: z.boolean(),
  likes_count: z.number(),
});

// Comment schemas
export const commentSchema = z.object({
  id: z.number(),
  post_id: z.number(),
  user_id: z.number(),
  content: z.string(),
  created_at: z.string(),
});

export const commentWithAuthorSchema = commentSchema.extend({
  author_name: z.string(),
});

export const createCommentInputSchema = z.object({
  content: z.string().min(1, "Content is required").max(1000, "Content must be at most 1000 characters"),
});

export const updateCommentInputSchema = z.object({
  content: z.string().min(1).max(1000).optional(),
});

export const commentsResponseSchema = z.object({
  comments: z.array(commentWithAuthorSchema),
});

export const commentResponseSchema = z.object({
  comment: commentWithAuthorSchema,
});

// Follow schemas
export const userBasicSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

export const followResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const followingResponseSchema = z.object({
  following: z.array(userBasicSchema),
});

export const followersResponseSchema = z.object({
  followers: z.array(userBasicSchema),
});

export const isFollowingResponseSchema = z.object({
  isFollowing: z.boolean(),
});

// Story schemas
export const storySchema = z.object({
  id: z.number(),
  user_id: z.number(),
  image_url: z.string().url(),
  expires_at: z.string(),
  created_at: z.string(),
});

export const storyWithAuthorSchema = storySchema.extend({
  author_name: z.string(),
});

export const storiesResponseSchema = z.object({
  stories: z.array(storyWithAuthorSchema),
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
export type CreatePostInput = z.infer<typeof createPostInputSchema>;
export type UpdatePostInput = z.infer<typeof updatePostInputSchema>;
export type LikeResponse = z.infer<typeof likeResponseSchema>;

export type Comment = z.infer<typeof commentSchema>;
export type CommentWithAuthor = z.infer<typeof commentWithAuthorSchema>;
export type CreateCommentInput = z.infer<typeof createCommentInputSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentInputSchema>;

export type UserBasic = z.infer<typeof userBasicSchema>;
export type FollowResponse = z.infer<typeof followResponseSchema>;
export type IsFollowingResponse = z.infer<typeof isFollowingResponseSchema>;

export type Story = z.infer<typeof storySchema>;
export type StoryWithAuthor = z.infer<typeof storyWithAuthorSchema>;
