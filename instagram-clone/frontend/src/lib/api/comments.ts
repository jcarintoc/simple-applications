import { apiClient } from "./client";
import {
  type CommentWithAuthor,
  type CreateCommentInput,
  type UpdateCommentInput,
  commentsResponseSchema,
  commentResponseSchema,
} from "./types";

export const commentsApi = {
  getCommentsByPost: async (postId: number): Promise<CommentWithAuthor[]> => {
    const response = await apiClient.get(`/posts/${postId}/comments`);
    return commentsResponseSchema.parse(response.data).comments;
  },

  createComment: async (postId: number, data: CreateCommentInput): Promise<CommentWithAuthor> => {
    const response = await apiClient.post(`/posts/${postId}/comments`, data);
    return commentResponseSchema.parse(response.data).comment;
  },

  updateComment: async (id: number, data: UpdateCommentInput): Promise<CommentWithAuthor> => {
    const response = await apiClient.put(`/comments/${id}`, data);
    return commentResponseSchema.parse(response.data).comment;
  },

  deleteComment: async (id: number): Promise<void> => {
    await apiClient.delete(`/comments/${id}`);
  },
};
