import { z } from "zod";
import { apiClient } from "./client";

// Schemas
export const commentSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  post_id: z.number(),
  content: z.string(),
  created_at: z.string(),
  user_name: z.string(),
  user_email: z.string(),
  user_username: z.string(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1).max(500),
});

export const commentsResponseSchema = z.object({
  comments: z.array(commentSchema),
});

export const createCommentResponseSchema = z.object({
  message: z.string(),
  commentId: z.number(),
});

// Types
export type Comment = z.infer<typeof commentSchema>;
export type CreateCommentData = z.infer<typeof createCommentSchema>;

// API Functions
export const commentsApi = {
  createComment: async (postId: number, data: CreateCommentData) => {
    const response = await apiClient.post(`/posts/${postId}/comments`, data);
    return createCommentResponseSchema.parse(response.data);
  },

  getComments: async (postId: number, limit: number = 50, offset: number = 0) => {
    const response = await apiClient.get(`/posts/${postId}/comments`, {
      params: { limit, offset },
    });
    return commentsResponseSchema.parse(response.data);
  },

  deleteComment: async (commentId: number) => {
    const response = await apiClient.delete(`/comments/${commentId}`);
    return response.data;
  },
};
