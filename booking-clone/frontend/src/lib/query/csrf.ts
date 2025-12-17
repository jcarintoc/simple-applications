import { useQuery } from "@tanstack/react-query";
import { csrfApi } from "../api";

export const csrfKeys = {
  token: () => ["csrf", "token"] as const,
};

export function useCsrfToken() {
  return useQuery({
    queryKey: csrfKeys.token(),
    queryFn: csrfApi.getToken,
    staleTime: 25 * 60 * 1000, // Token valid for 30 min, refetch before expiry
    gcTime: 30 * 60 * 1000,
  });
}
