import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../api";

export const userKeys = {
  all: ["users"] as const,
  searches: () => [...userKeys.all, "search"] as const,
  search: (query: string) => [...userKeys.searches(), query] as const,
};

export function useUserSearch(query: string) {
  return useQuery({
    queryKey: userKeys.search(query),
    queryFn: () => usersApi.search(query),
    enabled: query.trim().length > 0,
  });
}