import { apiClient } from "./client";
import {
  type PostWithAuthor,
  type CreatePostInput,
  type UpdatePostInput,
  type LikeResponse,
  postsResponseSchema,
  postResponseSchema,
  likeResponseSchema,
} from "./types";

export const postsApi = {
  getFeed: async (): Promise<PostWithAuthor[]> => {
    const response = await apiClient.get("/posts/feed");
    return postsResponseSchema.parse(response.data).posts;
  },

  getPosts: async (userId?: number): Promise<PostWithAuthor[]> => {
    const params = userId ? `?user_id=${userId}` : "";
    const response = await apiClient.get(`/posts${params}`);
    return postsResponseSchema.parse(response.data).posts;
  },

  getPostById: async (id: number): Promise<PostWithAuthor> => {
    const response = await apiClient.get(`/posts/${id}`);
    return postResponseSchema.parse(response.data).post;
  },

  getPostsByUser: async (userId: number): Promise<PostWithAuthor[]> => {
    const response = await apiClient.get(`/users/${userId}/posts`);
    return postsResponseSchema.parse(response.data).posts;
  },

  createPost: async (data: CreatePostInput): Promise<PostWithAuthor> => {
    const response = await apiClient.post("/posts", data);
    return postResponseSchema.parse(response.data).post;
  },

  updatePost: async (id: number, data: UpdatePostInput): Promise<PostWithAuthor> => {
    const response = await apiClient.put(`/posts/${id}`, data);
    return postResponseSchema.parse(response.data).post;
  },

  deletePost: async (id: number): Promise<void> => {
    await apiClient.delete(`/posts/${id}`);
  },

  likePost: async (id: number): Promise<LikeResponse> => {
    const response = await apiClient.post(`/posts/${id}/like`);
    return likeResponseSchema.parse(response.data);
  },
};
