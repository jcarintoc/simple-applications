import { apiClient } from "./client";
import {
  savedResponseSchema,
  savedCheckResponseSchema,
  savedToggleResponseSchema,
  type SavedResponse,
} from "./types";

export const savedApi = {
  toggle: async (hotelId: number): Promise<{ saved: boolean }> => {
    const response = await apiClient.post("/saved/toggle", { hotelId });
    return savedToggleResponseSchema.parse(response.data);
  },

  getMySaved: async (): Promise<SavedResponse> => {
    const response = await apiClient.get("/saved");
    return savedResponseSchema.parse(response.data);
  },

  checkSaved: async (hotelId: number): Promise<{ saved: boolean }> => {
    const response = await apiClient.get(`/saved/check/${hotelId}`);
    return savedCheckResponseSchema.parse(response.data);
  },
};
