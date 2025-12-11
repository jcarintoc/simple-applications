import { apiClient } from "./client";
import type {
  PalettesResponse,
  PaletteResponse,
  PaletteCreatedResponse,
  CreatePaletteInput,
  UpdatePaletteInput,
  CsrfTokenResponse,
} from "./types";

export const paletteApi = {
  getAll: async (): Promise<PalettesResponse> => {
    const response = await apiClient.get<PalettesResponse>("/palettes");
    return response.data;
  },

  getById: async (id: number): Promise<PaletteResponse> => {
    const response = await apiClient.get<PaletteResponse>(`/palettes/${id}`);
    return response.data;
  },

  create: async (data: CreatePaletteInput): Promise<PaletteCreatedResponse> => {
    const response = await apiClient.post<PaletteCreatedResponse>("/palettes", data);
    return response.data;
  },

  update: async (id: number, data: UpdatePaletteInput): Promise<PaletteCreatedResponse> => {
    const response = await apiClient.put<PaletteCreatedResponse>(`/palettes/${id}`, data);
    return response.data;
  },

  delete: async (id: number, csrfToken: string): Promise<void> => {
    await apiClient.delete(`/palettes/${id}`, {
      headers: {
        "X-CSRF-Token": csrfToken,
      },
    });
  },

  getCsrfToken: async (): Promise<CsrfTokenResponse> => {
    const response = await apiClient.get<CsrfTokenResponse>("/palettes/csrf-token");
    return response.data;
  },
};

