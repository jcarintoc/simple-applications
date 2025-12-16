import type { Request, Response } from "express";
import { videoService } from "../services/video.service.js";
import { createVideoSchema, updateVideoSchema } from "../types/index.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export const videoController = {
  getVideos(req: Request, res: Response): void {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const userId = (req as AuthRequest).userId;

      const result = videoService.getVideos(page, limit, userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch videos" });
    }
  },

  getVideoById(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id);
      const userId = (req as AuthRequest).userId;

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid video ID" });
        return;
      }

      const video = videoService.getVideoById(id, userId);

      if (!video) {
        res.status(404).json({ error: "Video not found" });
        return;
      }

      res.json(video);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch video" });
    }
  },

  getVideosByUser(req: Request, res: Response): void {
    try {
      const userId = parseInt(req.params.userId);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
      }

      const result = videoService.getVideosByUserId(userId, page, limit);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user videos" });
    }
  },

  uploadVideo(req: AuthRequest, res: Response): void {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No video file uploaded" });
        return;
      }

      const parseResult = createVideoSchema.safeParse(req.body);

      if (!parseResult.success) {
        res.status(400).json({ error: parseResult.error.errors[0].message });
        return;
      }

      const video = videoService.createVideo(req.userId!, {
        title: parseResult.data.title,
        description: parseResult.data.description,
        filename: req.file.filename
      });

      res.status(201).json(video);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload video";
      res.status(500).json({ error: message });
    }
  },

  updateVideo(req: AuthRequest, res: Response): void {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid video ID" });
        return;
      }

      const parseResult = updateVideoSchema.safeParse(req.body);

      if (!parseResult.success) {
        res.status(400).json({ error: parseResult.error.errors[0].message });
        return;
      }

      const video = videoService.updateVideo(id, req.userId!, parseResult.data);
      res.json(video);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update video";
      const status = message.includes("Not authorized") ? 403 : message.includes("not found") ? 404 : 500;
      res.status(status).json({ error: message });
    }
  },

  deleteVideo(req: AuthRequest, res: Response): void {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid video ID" });
        return;
      }

      videoService.deleteVideo(id, req.userId!);
      res.status(204).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete video";
      const status = message.includes("Not authorized") ? 403 : message.includes("not found") ? 404 : 500;
      res.status(status).json({ error: message });
    }
  },

  incrementViews(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid video ID" });
        return;
      }

      const success = videoService.incrementViews(id);

      if (!success) {
        res.status(404).json({ error: "Video not found" });
        return;
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to increment views" });
    }
  },

  searchVideos(req: Request, res: Response): void {
    try {
      const query = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      if (!query || query.trim().length === 0) {
        res.status(400).json({ error: "Search query is required" });
        return;
      }

      const result = videoService.searchVideos(query.trim(), page, limit);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to search videos" });
    }
  }
};
