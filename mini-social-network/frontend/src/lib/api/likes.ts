import { z } from "zod";
import { apiClient } from "./client";

// Schemas
export const likeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const userBasicSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  username: z.string(),
});

export const likesResponseSchema = z.object({
  users: z.array(userBasicSchema),
});

// Types
export type UserBasic = z.infer<typeof userBasicSchema>;

// API Functions
export const likesApi = {
  likePost: async (postId: number) => {
    const response = await apiClient.post(`/posts/${postId}/like`);
    return likeResponseSchema.parse(response.data);
  },

  unlikePost: async (postId: number) => {
    const response = await apiClient.delete(`/posts/${postId}/like`);
    return likeResponseSchema.parse(response.data);
  },

  getPostLikes: async (postId: number, limit: number = 50, offset: number = 0) => {
    const response = await apiClient.get(`/posts/${postId}/likes`, {
      params: { limit, offset },
    });
    return likesResponseSchema.parse(response.data);
  },
};
