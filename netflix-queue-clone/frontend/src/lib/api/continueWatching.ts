import { apiClient } from "./client";
import {
  type ProgressInput,
  type ContinueWatchingResponse,
  continueWatchingResponseSchema,
} from "./types";

export const continueWatchingApi = {
  getContinueWatching: async (): Promise<ContinueWatchingResponse> => {
    const response = await apiClient.get<ContinueWatchingResponse>("/continue-watching");
    return continueWatchingResponseSchema.parse(response.data);
  },

  updateProgress: async (titleId: number, data: ProgressInput): Promise<void> => {
    await apiClient.post(`/continue-watching/${titleId}`, data);
  },

  removeFromContinueWatching: async (titleId: number): Promise<void> => {
    await apiClient.delete(`/continue-watching/${titleId}`);
  },

  clearAll: async (): Promise<void> => {
    await apiClient.delete("/continue-watching");
  },
};
