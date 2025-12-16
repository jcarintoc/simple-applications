import { apiClient } from "./client";
import {
  type UserBasic,
  type FollowResponse,
  type IsFollowingResponse,
  followResponseSchema,
  followingResponseSchema,
  followersResponseSchema,
  isFollowingResponseSchema,
} from "./types";

export const followsApi = {
  followUser: async (userId: number): Promise<FollowResponse> => {
    const response = await apiClient.post(`/users/${userId}/follow`);
    return followResponseSchema.parse(response.data);
  },

  unfollowUser: async (userId: number): Promise<FollowResponse> => {
    const response = await apiClient.delete(`/users/${userId}/follow`);
    return followResponseSchema.parse(response.data);
  },

  getFollowing: async (userId: number): Promise<UserBasic[]> => {
    const response = await apiClient.get(`/users/${userId}/following`);
    return followingResponseSchema.parse(response.data).following;
  },

  getFollowers: async (userId: number): Promise<UserBasic[]> => {
    const response = await apiClient.get(`/users/${userId}/followers`);
    return followersResponseSchema.parse(response.data).followers;
  },

  isFollowing: async (userId: number): Promise<boolean> => {
    const response = await apiClient.get(`/users/${userId}/following/check`);
    return isFollowingResponseSchema.parse(response.data).isFollowing;
  },
};
