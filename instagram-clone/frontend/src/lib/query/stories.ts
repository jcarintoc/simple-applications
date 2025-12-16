import { useQuery } from "@tanstack/react-query";
import { storiesApi } from "../api";

export const storyKeys = {
  all: ["stories"] as const,
  active: () => [...storyKeys.all, "active"] as const,
  user: (userId: number) => [...storyKeys.all, "user", userId] as const,
};

export function useActiveStories() {
  return useQuery({
    queryKey: storyKeys.active(),
    queryFn: () => storiesApi.getActiveStories(),
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useStoriesByUser(userId: number) {
  return useQuery({
    queryKey: storyKeys.user(userId),
    queryFn: () => storiesApi.getStoriesByUser(userId),
    enabled: !!userId,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}
