import { apiClient } from "./client";
import { csrfTokenResponseSchema } from "./types";
import type { CsrfTokenResponse } from "./types";

export const getCsrfToken = async (): Promise<CsrfTokenResponse> => {
  const { data } = await apiClient.get("/csrf/token");
  return csrfTokenResponseSchema.parse(data);
};
