import { apiClient } from "./client";
import {
  type TitleType,
  type TitlesResponse,
  type GenresResponse,
  titlesResponseSchema,
  genresResponseSchema,
} from "./types";

export const titlesApi = {
  getAll: async (type?: TitleType): Promise<TitlesResponse> => {
    const params = type ? { type } : {};
    const response = await apiClient.get<TitlesResponse>("/titles", { params });
    return titlesResponseSchema.parse(response.data);
  },

  search: async (query: string): Promise<TitlesResponse> => {
    const response = await apiClient.get<TitlesResponse>("/titles/search", {
      params: { q: query },
    });
    return titlesResponseSchema.parse(response.data);
  },

  getGenres: async (): Promise<GenresResponse> => {
    const response = await apiClient.get<GenresResponse>("/titles/genres");
    return genresResponseSchema.parse(response.data);
  },
};
