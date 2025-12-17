import { apiClient } from "./client";
import {
  type SongsResponse,
  type ToggleLikeResponse,
  songsResponseSchema,
  toggleLikeResponseSchema,
} from "./types";

function getCsrfToken(): string {
  const match = document.cookie.match(/csrf_token=([^;]+)/);
  return match ? match[1] : "";
}

export const likesApi = {
  getLikedSongs: async (): Promise<SongsResponse> => {
    const response = await apiClient.get<SongsResponse>("/likes");
    return songsResponseSchema.parse(response.data);
  },

  toggleLike: async (songId: number): Promise<ToggleLikeResponse> => {
    const response = await apiClient.post<ToggleLikeResponse>(
      `/likes/${songId}`,
      {},
      {
        headers: { "x-csrf-token": getCsrfToken() },
      }
    );
    return toggleLikeResponseSchema.parse(response.data);
  },
};
