import { apiClient } from "./client";
import type { Video, VideosResponse, UpdateVideoInput } from "./types";

export async function getVideos(page = 1, limit = 20): Promise<VideosResponse> {
  const response = await apiClient.get<VideosResponse>("/videos", {
    params: { page, limit },
  });
  return response.data;
}

export async function getVideoById(id: number): Promise<Video> {
  const response = await apiClient.get<Video>(`/videos/${id}`);
  return response.data;
}

export async function getVideosByUser(userId: number, page = 1, limit = 20): Promise<VideosResponse> {
  const response = await apiClient.get<VideosResponse>(`/videos/user/${userId}`, {
    params: { page, limit },
  });
  return response.data;
}

export async function uploadVideo(data: FormData): Promise<Video> {
  const response = await apiClient.post<Video>("/videos", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function updateVideo(id: number, data: UpdateVideoInput): Promise<Video> {
  const response = await apiClient.put<Video>(`/videos/${id}`, data);
  return response.data;
}

export async function deleteVideo(id: number): Promise<void> {
  await apiClient.delete(`/videos/${id}`);
}

export async function incrementViews(id: number): Promise<void> {
  await apiClient.post(`/videos/${id}/view`);
}

export async function searchVideos(query: string, page = 1, limit = 20): Promise<VideosResponse> {
  const response = await apiClient.get<VideosResponse>("/videos/search", {
    params: { q: query, page, limit },
  });
  return response.data;
}
