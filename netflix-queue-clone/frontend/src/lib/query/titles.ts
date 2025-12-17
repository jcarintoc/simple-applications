import { useQuery } from "@tanstack/react-query";
import { titlesApi, type TitleType } from "../api";

export const titlesKeys = {
  all: ["titles"] as const,
  lists: () => [...titlesKeys.all, "list"] as const,
  list: (type?: TitleType) => [...titlesKeys.lists(), type] as const,
  search: (query: string) => [...titlesKeys.all, "search", query] as const,
  genres: () => [...titlesKeys.all, "genres"] as const,
};

export function useTitles(type?: TitleType) {
  return useQuery({
    queryKey: titlesKeys.list(type),
    queryFn: () => titlesApi.getAll(type),
  });
}

export function useSearchTitles(query: string) {
  return useQuery({
    queryKey: titlesKeys.search(query),
    queryFn: () => titlesApi.search(query),
    enabled: query.length > 0,
  });
}

export function useGenres() {
  return useQuery({
    queryKey: titlesKeys.genres(),
    queryFn: titlesApi.getGenres,
  });
}