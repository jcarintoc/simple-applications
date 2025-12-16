import { apiClient } from "./client";
import {
  type StoryWithAuthor,
  storiesResponseSchema,
} from "./types";

export const storiesApi = {
  getActiveStories: async (): Promise<StoryWithAuthor[]> => {
    const response = await apiClient.get("/stories");
    return storiesResponseSchema.parse(response.data).stories;
  },

  getStoriesByUser: async (userId: number): Promise<StoryWithAuthor[]> => {
    const response = await apiClient.get(`/users/${userId}/stories`);
    return storiesResponseSchema.parse(response.data).stories;
  },
};
