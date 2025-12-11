import { z } from "zod";
import { apiClient } from "./client";

// Schemas
export const userProfileSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  username: z.string(),
  created_at: z.string(),
  followerCount: z.number(),
  followingCount: z.number(),
});

export const userProfileResponseSchema = z.object({
  user: userProfileSchema,
});

// Types
export type UserProfile = z.infer<typeof userProfileSchema>;

// API Functions
export const usersApi = {
  getUserProfile: async (userId: number) => {
    const response = await apiClient.get(`/users/${userId}`);
    return userProfileResponseSchema.parse(response.data);
  },
};
