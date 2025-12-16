import { apiClient } from "./client";
import {
  type PostWithAuthor,
  type CreatePostInput,
  type UpdatePostInput,
  type UpvoteResponse,
  postsResponseSchema,
  postResponseSchema,
  upvoteResponseSchema,
} from "./types";

export const postsApi = {
  getPosts: async (subredditId?: number): Promise<PostWithAuthor[]> => {
    const params = subredditId ? `?subreddit_id=${subredditId}` : "";
    const response = await apiClient.get(`/posts${params}`);
    return postsResponseSchema.parse(response.data).posts;
  },

  getPostById: async (id: number): Promise<PostWithAuthor> => {
    const response = await apiClient.get(`/posts/${id}`);
    return postResponseSchema.parse(response.data).post;
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

  upvotePost: async (id: number): Promise<UpvoteResponse> => {
    const response = await apiClient.post(`/posts/${id}/upvote`);
    return upvoteResponseSchema.parse(response.data);
  },
};
