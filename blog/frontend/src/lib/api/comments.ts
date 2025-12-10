import { apiClient } from "./client";
import { commentSchema, commentWithAuthorSchema } from "./types";
import type { CreateCommentInput, Comment, CommentWithAuthor } from "./types";
import { z } from "zod";

export const getCommentsByPostId = async (postId: number): Promise<CommentWithAuthor[]> => {
  const { data } = await apiClient.get(`/comments/post/${postId}`);
  return z.array(commentWithAuthorSchema).parse(data);
};

export const createComment = async (
  postId: number,
  input: CreateCommentInput,
  csrfToken: string
): Promise<Comment> => {
  const { data } = await apiClient.post(`/comments/post/${postId}`, input, {
    headers: {
      "x-csrf-token": csrfToken,
    },
  });
  return commentSchema.parse(data);
};

export const deleteComment = async (id: number, csrfToken: string): Promise<void> => {
  await apiClient.delete(`/comments/${id}`, {
    headers: {
      "x-csrf-token": csrfToken,
    },
  });
};
