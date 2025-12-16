import { apiClient } from "./client";

export async function likeVideo(videoId: number): Promise<void> {
  await apiClient.post(`/videos/${videoId}/like`);
}

export async function unlikeVideo(videoId: number): Promise<void> {
  await apiClient.delete(`/videos/${videoId}/like`);
}
