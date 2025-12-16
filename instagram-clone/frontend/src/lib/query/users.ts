import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../api/users";

export const userKeys = {
  all: ["users"] as const,
  search: (query: string) => [...userKeys.all, "search", query] as const,
};

export function useSearchUsers(query: string, limit?: number) {
  return useQuery({
    queryKey: userKeys.search(query),
    queryFn: () => usersApi.searchUsers(query, limit),
    enabled: query.trim().length > 0,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}
