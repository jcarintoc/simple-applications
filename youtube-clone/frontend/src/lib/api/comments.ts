import { apiClient } from "./client";
import type { Comment, CreateCommentInput } from "./types";

export async function getComments(videoId: number): Promise<Comment[]> {
  const response = await apiClient.get<Comment[]>(`/videos/${videoId}/comments`);
  return response.data;
}

export async function createComment(videoId: number, data: CreateCommentInput): Promise<Comment> {
  const response = await apiClient.post<Comment>(`/videos/${videoId}/comments`, data);
  return response.data;
}

export async function updateComment(id: number, data: CreateCommentInput): Promise<Comment> {
  const response = await apiClient.put<Comment>(`/comments/${id}`, data);
  return response.data;
}

export async function deleteComment(id: number): Promise<void> {
  await apiClient.delete(`/comments/${id}`);
}
