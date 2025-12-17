import { apiClient } from "./client";
import {
  type TitlesResponse,
  type WatchlistToggleResponse,
  titlesResponseSchema,
  watchlistToggleResponseSchema,
} from "./types";

function getCsrfToken(): string {
  const match = document.cookie.match(/csrf_token=([^;]+)/);
  return match ? match[1] : "";
}

export const watchlistApi = {
  getWatchlist: async (): Promise<TitlesResponse> => {
    const response = await apiClient.get<TitlesResponse>("/watchlist");
    return titlesResponseSchema.parse(response.data);
  },

  toggleWatchlist: async (titleId: number): Promise<WatchlistToggleResponse> => {
    const response = await apiClient.post<WatchlistToggleResponse>(
      `/watchlist/${titleId}`,
      {},
      { headers: { "x-csrf-token": getCsrfToken() } }
    );
    return watchlistToggleResponseSchema.parse(response.data);
  },

  addToWatchlist: async (titleId: number): Promise<void> => {
    await apiClient.post(
      `/watchlist/${titleId}/add`,
      {},
      { headers: { "x-csrf-token": getCsrfToken() } }
    );
  },

  removeFromWatchlist: async (titleId: number): Promise<void> => {
    await apiClient.delete(`/watchlist/${titleId}`, {
      headers: { "x-csrf-token": getCsrfToken() },
    });
  },
};
