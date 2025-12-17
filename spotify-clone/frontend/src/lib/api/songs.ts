import { apiClient } from "./client";
import {
  type SongsResponse,
  songsResponseSchema,
} from "./types";

export const songsApi = {
  getAll: async (): Promise<SongsResponse> => {
    const response = await apiClient.get<SongsResponse>("/songs");
    return songsResponseSchema.parse(response.data);
  },

  search: async (query: string): Promise<SongsResponse> => {
    const response = await apiClient.get<SongsResponse>("/songs/search", {
      params: { q: query },
    });
    return songsResponseSchema.parse(response.data);
  },
};
