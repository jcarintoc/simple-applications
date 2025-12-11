import { z } from "zod";
import { apiClient } from "./client";
import { userBasicSchema } from "./likes";

// Schemas
export const followResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const followersResponseSchema = z.object({
  followers: z.array(userBasicSchema),
});

export const followingResponseSchema = z.object({
  following: z.array(userBasicSchema),
});

export const isFollowingResponseSchema = z.object({
  isFollowing: z.boolean(),
});

// API Functions
export const followsApi = {
  followUser: async (userId: number) => {
    const response = await apiClient.post(`/users/${userId}/follow`);
    return followResponseSchema.parse(response.data);
  },

  unfollowUser: async (userId: number) => {
    const response = await apiClient.delete(`/users/${userId}/follow`);
    return followResponseSchema.parse(response.data);
  },

  getFollowers: async (userId: number, limit: number = 50, offset: number = 0) => {
    const response = await apiClient.get(`/users/${userId}/followers`, {
      params: { limit, offset },
    });
    return followersResponseSchema.parse(response.data);
  },

  getFollowing: async (userId: number, limit: number = 50, offset: number = 0) => {
    const response = await apiClient.get(`/users/${userId}/following`, {
      params: { limit, offset },
    });
    return followingResponseSchema.parse(response.data);
  },

  checkFollowing: async (userId: number) => {
    const response = await apiClient.get(`/users/${userId}/following/check`);
    return isFollowingResponseSchema.parse(response.data);
  },
};
