import { apiClient } from "./client";
import { type User, usersSearchResponseSchema } from "./types";

export const usersApi = {
  search: async (query: string): Promise<User[]> => {
    if (!query.trim()) return [];
    const response = await apiClient.get(`/users/search?q=${encodeURIComponent(query)}`);
    return usersSearchResponseSchema.parse(response.data).users;
  },
};