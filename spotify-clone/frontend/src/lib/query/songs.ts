import { useQuery } from "@tanstack/react-query";
import { songsApi } from "../api";

export const songKeys = {
  all: ["songs"] as const,
  list: () => [...songKeys.all, "list"] as const,
  search: (query: string) => [...songKeys.all, "search", query] as const,
};

export function useSongs() {
  return useQuery({
    queryKey: songKeys.list(),
    queryFn: songsApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSongSearch(query: string) {
  return useQuery({
    queryKey: songKeys.search(query),
    queryFn: () => songsApi.search(query),
    enabled: query.length > 0,
    staleTime: 60 * 1000, // 1 minute
  });
}
