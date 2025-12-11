import { apiClient } from "./client";
import {
  type CreateFavoriteInput,
  type UpdateFavoriteInput,
  type Favorite,
  type FavoriteResponse,
  type FavoritesResponse,
  type CSRFTokenResponse,
  favoritesResponseSchema,
  favoriteResponseSchema,
  csrfTokenResponseSchema,
} from "./types";

export const favoritesApi = {
  getAll: async (): Promise<Favorite[]> => {
    const response = await apiClient.get<FavoritesResponse>("/favorites");
    const data = favoritesResponseSchema.parse(response.data);
    return data.favorites;
  },

  create: async (data: CreateFavoriteInput, csrfToken: string): Promise<Favorite> => {
    const response = await apiClient.post<FavoriteResponse>("/favorites", data, {
      headers: {
        "X-CSRF-Token": csrfToken,
      },
    });
    const parsed = favoriteResponseSchema.parse(response.data);
    return parsed.favorite;
  },

  update: async (id: number, data: UpdateFavoriteInput, csrfToken: string): Promise<Favorite> => {
    const response = await apiClient.put<FavoriteResponse>(`/favorites/${id}`, data, {
      headers: {
        "X-CSRF-Token": csrfToken,
      },
    });
    const parsed = favoriteResponseSchema.parse(response.data);
    return parsed.favorite;
  },

  delete: async (id: number, csrfToken: string): Promise<void> => {
    await apiClient.delete(`/favorites/${id}`, {
      headers: {
        "X-CSRF-Token": csrfToken,
      },
    });
  },

  getCSRFToken: async (): Promise<string> => {
    const response = await apiClient.get<CSRFTokenResponse>("/csrf-token");
    const data = csrfTokenResponseSchema.parse(response.data);
    return data.csrfToken;
  },
};

