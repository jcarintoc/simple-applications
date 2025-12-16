import { apiClient } from "./client";
import {
  type CommentWithAuthor,
  type CreateCommentInput,
  type UpdateCommentInput,
  type UpvoteResponse,
  commentsResponseSchema,
  commentResponseSchema,
  upvoteResponseSchema,
} from "./types";

export const commentsApi = {
  getCommentsByPost: async (postId: number): Promise<CommentWithAuthor[]> => {
    const response = await apiClient.get(`/posts/${postId}/comments`);
    return commentsResponseSchema.parse(response.data).comments;
  },

  getCommentById: async (id: number): Promise<CommentWithAuthor> => {
    const response = await apiClient.get(`/comments/${id}`);
    return commentResponseSchema.parse(response.data).comment;
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

  upvoteComment: async (id: number): Promise<UpvoteResponse> => {
    const response = await apiClient.post(`/comments/${id}/upvote`);
    return upvoteResponseSchema.parse(response.data);
  },
};
