import { videoRepository } from "../repositories/video.repository.js";
import type { VideoWithUser, CreateVideoDto, UpdateVideoDto } from "../types/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const videosDir = path.join(__dirname, "../../uploads/videos");

export const videoService = {
  getVideos(page = 1, limit = 20, userId?: number): { videos: VideoWithUser[]; total: number; page: number; totalPages: number } {
    const offset = (page - 1) * limit;
    const videos = videoRepository.findAll(limit, offset, userId);
    const total = videoRepository.count();

    return {
      videos,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  },

  getVideoById(id: number, userId?: number): VideoWithUser | undefined {
    return videoRepository.findById(id, userId);
  },

  getVideosByUserId(userId: number, page = 1, limit = 20): { videos: VideoWithUser[]; total: number; page: number; totalPages: number } {
    const offset = (page - 1) * limit;
    const videos = videoRepository.findByUserId(userId, limit, offset);
    const total = videoRepository.countByUserId(userId);

    return {
      videos,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  },

  createVideo(userId: number, data: CreateVideoDto): VideoWithUser {
    const id = videoRepository.create(userId, data);
    const video = videoRepository.findById(id, userId);

    if (!video) {
      throw new Error("Failed to create video");
    }

    return video;
  },

  updateVideo(id: number, userId: number, data: UpdateVideoDto): VideoWithUser {
    const owner = videoRepository.getOwner(id);

    if (!owner) {
      throw new Error("Video not found");
    }

    if (owner !== userId) {
      throw new Error("Not authorized to update this video");
    }

    videoRepository.update(id, data);
    const video = videoRepository.findById(id, userId);

    if (!video) {
      throw new Error("Failed to update video");
    }

    return video;
  },

  deleteVideo(id: number, userId: number): void {
    const video = videoRepository.findById(id);

    if (!video) {
      throw new Error("Video not found");
    }

    if (video.user_id !== userId) {
      throw new Error("Not authorized to delete this video");
    }

    // Delete the video file
    const filePath = path.join(videosDir, video.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    videoRepository.delete(id);
  },

  incrementViews(id: number): boolean {
    return videoRepository.incrementViews(id);
  },

  searchVideos(query: string, page = 1, limit = 20): { videos: VideoWithUser[]; total: number; page: number; totalPages: number } {
    const offset = (page - 1) * limit;
    const videos = videoRepository.search(query, limit, offset);

    return {
      videos,
      total: videos.length,
      page,
      totalPages: 1
    };
  }
};
