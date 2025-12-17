import { apiClient } from "./client";
import { csrfResponseSchema, type CsrfResponse } from "./types";

export const csrfApi = {
  getToken: async (): Promise<CsrfResponse> => {
    const response = await apiClient.get("/csrf/token");
    return csrfResponseSchema.parse(response.data);
  },
};
