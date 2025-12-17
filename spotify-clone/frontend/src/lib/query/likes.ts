import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { likesApi } from "../api";
import { songKeys } from "./songs";
import { playlistKeys } from "./playlists";

export const likeKeys = {
  all: ["likes"] as const,
  list: () => [...likeKeys.all, "list"] as const,
};

export function useLikedSongs() {
  return useQuery({
    queryKey: likeKeys.list(),
    queryFn: likesApi.getLikedSongs,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (songId: number) => likesApi.toggleLike(songId),
    onSuccess: () => {
      // Invalidate all song-related queries
      queryClient.invalidateQueries({ queryKey: songKeys.all });
      queryClient.invalidateQueries({ queryKey: likeKeys.list() });
      queryClient.invalidateQueries({ queryKey: playlistKeys.all });
    },
  });
}
