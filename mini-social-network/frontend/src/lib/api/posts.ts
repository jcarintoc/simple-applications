import { z } from "zod";
import { apiClient } from "./client";

// Schemas
export const postSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  content: z.string(),
  created_at: z.string(),
  user_name: z.string(),
  user_email: z.string(),
  user_username: z.string(),
  likeCount: z.number(),
  commentCount: z.number(),
  isLiked: z.boolean().optional(),
});

export const createPostSchema = z.object({
  content: z.string().min(1).max(1000),
});

export const postsResponseSchema = z.object({
  posts: z.array(postSchema),
});

export const postResponseSchema = z.object({
  post: postSchema,
});

export const createPostResponseSchema = z.object({
  message: z.string(),
  post: postSchema,
});

// Types
export type Post = z.infer<typeof postSchema>;
export type CreatePostData = z.infer<typeof createPostSchema>;

// API Functions
export const postsApi = {
  createPost: async (data: CreatePostData) => {
    const response = await apiClient.post("/posts", data);
    return createPostResponseSchema.parse(response.data);
  },

  getFeed: async (limit: number = 50, offset: number = 0) => {
    const response = await apiClient.get("/posts", {
      params: { limit, offset },
    });
    return postsResponseSchema.parse(response.data);
  },

  getPost: async (id: number) => {
    const response = await apiClient.get(`/posts/${id}`);
    return postResponseSchema.parse(response.data);
  },

  getUserPosts: async (userId: number, limit: number = 50, offset: number = 0) => {
    const response = await apiClient.get(`/users/${userId}/posts`, {
      params: { limit, offset },
    });
    return postsResponseSchema.parse(response.data);
  },

  deletePost: async (id: number) => {
    const response = await apiClient.delete(`/posts/${id}`);
    return response.data;
  },
};
