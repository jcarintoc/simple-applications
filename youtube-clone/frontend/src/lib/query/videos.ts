import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  getVideos,
  getVideoById,
  getVideosByUser,
  uploadVideo,
  updateVideo,
  deleteVideo,
  incrementViews,
  searchVideos,
} from "../api/videos";
import type { UpdateVideoInput } from "../api/types";

export const videoKeys = {
  all: ["videos"] as const,
  lists: () => [...videoKeys.all, "list"] as const,
  list: (page: number, limit: number) => [...videoKeys.lists(), { page, limit }] as const,
  details: () => [...videoKeys.all, "detail"] as const,
  detail: (id: number) => [...videoKeys.details(), id] as const,
  byUser: (userId: number) => [...videoKeys.all, "user", userId] as const,
  search: (query: string) => [...videoKeys.all, "search", query] as const,
};

export function useVideos(page = 1, limit = 20) {
  return useQuery({
    queryKey: videoKeys.list(page, limit),
    queryFn: () => getVideos(page, limit),
    staleTime: 1000 * 60,
  });
}

export function useVideo(id: number) {
  return useQuery({
    queryKey: videoKeys.detail(id),
    queryFn: () => getVideoById(id),
    staleTime: 1000 * 60,
    enabled: id > 0,
  });
}

export function useVideosByUser(userId: number, page = 1, limit = 20) {
  return useQuery({
    queryKey: [...videoKeys.byUser(userId), { page, limit }],
    queryFn: () => getVideosByUser(userId, page, limit),
    staleTime: 1000 * 60,
    enabled: userId > 0,
  });
}

export function useSearchVideos(query: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: [...videoKeys.search(query), { page, limit }],
    queryFn: () => searchVideos(query, page, limit),
    staleTime: 1000 * 60,
    enabled: query.length > 0,
  });
}

export function useUploadVideo() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: uploadVideo,
    onSuccess: (video) => {
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
      navigate(`/watch/${video.id}`);
    },
  });
}

export function useUpdateVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateVideoInput }) =>
      updateVideo(id, data),
    onSuccess: (video) => {
      queryClient.invalidateQueries({ queryKey: videoKeys.detail(video.id) });
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
    },
  });
}

export function useDeleteVideo() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: deleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
      navigate("/");
    },
  });
}

export function useIncrementViews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: incrementViews,
    onSuccess: (_, videoId) => {
      queryClient.invalidateQueries({ queryKey: videoKeys.detail(videoId) });
    },
  });
}
