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

// Subreddit schemas
export const subredditSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  creator_id: z.number(),
  created_at: z.string(),
});

export const subredditWithCreatorSchema = subredditSchema.extend({
  creator_name: z.string(),
});

export const createSubredditInputSchema = z.object({
  name: z.string().min(3, "Subreddit name must be at least 3 characters").regex(/^[a-zA-Z0-9_]+$/, "Subreddit name must be alphanumeric with underscores only"),
  description: z.string().min(1, "Description is required"),
});

export const updateSubredditInputSchema = createSubredditInputSchema.partial();

export const subredditsResponseSchema = z.object({
  subreddits: z.array(subredditWithCreatorSchema),
});

export const subredditResponseSchema = z.object({
  subreddit: subredditWithCreatorSchema,
});

// Post schemas
export const postSchema = z.object({
  id: z.number(),
  subreddit_id: z.number(),
  user_id: z.number(),
  title: z.string(),
  content: z.string(),
  upvotes: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const postWithAuthorSchema = postSchema.extend({
  author_name: z.string(),
  subreddit_name: z.string(),
});

export const createPostInputSchema = z.object({
  subreddit_id: z.number(),
  title: z.string().min(1, "Title is required").max(300, "Title must be at most 300 characters"),
  content: z.string().min(1, "Content is required").max(10000, "Content must be at most 10000 characters"),
});

export const updatePostInputSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  content: z.string().min(1).max(10000).optional(),
});

export const postsResponseSchema = z.object({
  posts: z.array(postWithAuthorSchema),
});

export const postResponseSchema = z.object({
  post: postWithAuthorSchema,
});

// Comment schemas
export const commentSchema = z.object({
  id: z.number(),
  post_id: z.number(),
  user_id: z.number(),
  parent_id: z.number().nullable(),
  content: z.string(),
  upvotes: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const commentWithAuthorSchema = commentSchema.extend({
  author_name: z.string(),
});

export const createCommentInputSchema = z.object({
  content: z.string().min(1, "Content is required").max(10000, "Content must be at most 10000 characters"),
  parent_id: z.number().nullable().optional(),
});

export const updateCommentInputSchema = z.object({
  content: z.string().min(1).max(10000).optional(),
});

export const commentsResponseSchema = z.object({
  comments: z.array(commentWithAuthorSchema),
});

export const commentResponseSchema = z.object({
  comment: commentWithAuthorSchema,
});

// Vote schemas
export const upvoteResponseSchema = z.object({
  hasVoted: z.boolean(),
  upvotes: z.number(),
});

// Types derived from schemas
export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export type Subreddit = z.infer<typeof subredditSchema>;
export type SubredditWithCreator = z.infer<typeof subredditWithCreatorSchema>;
export type CreateSubredditInput = z.infer<typeof createSubredditInputSchema>;
export type UpdateSubredditInput = z.infer<typeof updateSubredditInputSchema>;

export type Post = z.infer<typeof postSchema>;
export type PostWithAuthor = z.infer<typeof postWithAuthorSchema>;
export type CreatePostInput = z.infer<typeof createPostInputSchema>;
export type UpdatePostInput = z.infer<typeof updatePostInputSchema>;

export type Comment = z.infer<typeof commentSchema>;
export type CommentWithAuthor = z.infer<typeof commentWithAuthorSchema>;
export type CreateCommentInput = z.infer<typeof createCommentInputSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentInputSchema>;

export type UpvoteResponse = z.infer<typeof upvoteResponseSchema>;
