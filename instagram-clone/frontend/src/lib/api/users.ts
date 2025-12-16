import { apiClient } from "./client";
import { userSchema, type User } from "./types";

export const usersApi = {
  searchUsers: async (query: string, limit?: number): Promise<User[]> => {
    const params = new URLSearchParams({ q: query });
    if (limit) {
      params.append("limit", limit.toString());
    }
    const response = await apiClient.get(`/users/search?${params.toString()}`);
    return response.data.users.map((user: unknown) => userSchema.parse(user));
  },
};
