import { likeRepository } from "../repositories/like.repository.js";
import { videoRepository } from "../repositories/video.repository.js";

export const likeService = {
  likeVideo(userId: number, videoId: number): void {
    const video = videoRepository.findById(videoId);
    if (!video) {
      throw new Error("Video not found");
    }

    const alreadyLiked = likeRepository.findByUserAndVideo(userId, videoId);
    if (alreadyLiked) {
      throw new Error("Already liked");
    }

    likeRepository.create(userId, videoId);
  },

  unlikeVideo(userId: number, videoId: number): void {
    const video = videoRepository.findById(videoId);
    if (!video) {
      throw new Error("Video not found");
    }

    const deleted = likeRepository.delete(userId, videoId);
    if (!deleted) {
      throw new Error("Not liked");
    }
  },

  getLikeCount(videoId: number): number {
    return likeRepository.countByVideo(videoId);
  },

  isLiked(userId: number, videoId: number): boolean {
    return likeRepository.findByUserAndVideo(userId, videoId);
  },
};
