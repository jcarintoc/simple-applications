import type { Response } from "express";
import { likeService } from "../services/like.service.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export const likeController = {
  likeVideo(req: AuthRequest, res: Response): void {
    try {
      const videoId = parseInt(req.params.videoId);

      if (isNaN(videoId)) {
        res.status(400).json({ error: "Invalid video ID" });
        return;
      }

      likeService.likeVideo(req.userId!, videoId);
      res.status(201).json({ success: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to like video";
      const status = message === "Video not found" ? 404 : message === "Already liked" ? 400 : 500;
      res.status(status).json({ error: message });
    }
  },

  unlikeVideo(req: AuthRequest, res: Response): void {
    try {
      const videoId = parseInt(req.params.videoId);

      if (isNaN(videoId)) {
        res.status(400).json({ error: "Invalid video ID" });
        return;
      }

      likeService.unlikeVideo(req.userId!, videoId);
      res.status(200).json({ success: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to unlike video";
      const status = message === "Video not found" ? 404 : message === "Not liked" ? 400 : 500;
      res.status(status).json({ error: message });
    }
  },
};
