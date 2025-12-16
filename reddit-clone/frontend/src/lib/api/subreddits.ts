import { apiClient } from "./client";
import {
  type SubredditWithCreator,
  type CreateSubredditInput,
  type UpdateSubredditInput,
  subredditsResponseSchema,
  subredditResponseSchema,
} from "./types";

export const subredditsApi = {
  getSubreddits: async (): Promise<SubredditWithCreator[]> => {
    const response = await apiClient.get("/subreddits");
    return subredditsResponseSchema.parse(response.data).subreddits;
  },

  getSubredditById: async (id: number): Promise<SubredditWithCreator> => {
    const response = await apiClient.get(`/subreddits/${id}`);
    return subredditResponseSchema.parse(response.data).subreddit;
  },

  createSubreddit: async (data: CreateSubredditInput): Promise<SubredditWithCreator> => {
    const response = await apiClient.post("/subreddits", data);
    return subredditResponseSchema.parse(response.data).subreddit;
  },

  updateSubreddit: async (id: number, data: UpdateSubredditInput): Promise<SubredditWithCreator> => {
    const response = await apiClient.put(`/subreddits/${id}`, data);
    return subredditResponseSchema.parse(response.data).subreddit;
  },

  deleteSubreddit: async (id: number): Promise<void> => {
    await apiClient.delete(`/subreddits/${id}`);
  },
};
