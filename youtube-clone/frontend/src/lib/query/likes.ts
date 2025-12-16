import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeVideo, unlikeVideo } from "../api/likes";
import { videoKeys } from "./videos";
import type { Video } from "../api/types";

export function useLikeVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likeVideo,
    onMutate: async (videoId) => {
      await queryClient.cancelQueries({ queryKey: videoKeys.detail(videoId) });

      const previousVideo = queryClient.getQueryData<Video>(videoKeys.detail(videoId));

      if (previousVideo) {
        queryClient.setQueryData<Video>(videoKeys.detail(videoId), {
          ...previousVideo,
          is_liked: true,
          like_count: previousVideo.like_count + 1,
        });
      }

      return { previousVideo };
    },
    onError: (_err, videoId, context) => {
      if (context?.previousVideo) {
        queryClient.setQueryData(videoKeys.detail(videoId), context.previousVideo);
      }
    },
    onSettled: (_, __, videoId) => {
      queryClient.invalidateQueries({ queryKey: videoKeys.detail(videoId) });
    },
  });
}

export function useUnlikeVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unlikeVideo,
    onMutate: async (videoId) => {
      await queryClient.cancelQueries({ queryKey: videoKeys.detail(videoId) });

      const previousVideo = queryClient.getQueryData<Video>(videoKeys.detail(videoId));

      if (previousVideo) {
        queryClient.setQueryData<Video>(videoKeys.detail(videoId), {
          ...previousVideo,
          is_liked: false,
          like_count: Math.max(0, previousVideo.like_count - 1),
        });
      }

      return { previousVideo };
    },
    onError: (_err, videoId, context) => {
      if (context?.previousVideo) {
        queryClient.setQueryData(videoKeys.detail(videoId), context.previousVideo);
      }
    },
    onSettled: (_, __, videoId) => {
      queryClient.invalidateQueries({ queryKey: videoKeys.detail(videoId) });
    },
  });
}
