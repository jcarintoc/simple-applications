import { apiClient } from "./client";

export async function fetchCsrfToken(): Promise<void> {
  await apiClient.get("/csrf-token");
}
