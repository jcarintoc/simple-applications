import type { Response } from "express";
import { likeService } from "../services/index.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export class LikeController {
  getLikedSongs(req: AuthRequest, res: Response): void {
    const songs = likeService.getLikedSongs(req.userId!);
    res.json({ songs });
  }

  toggleLike(req: AuthRequest, res: Response): void {
    const songId = parseInt(req.params.songId);
    if (isNaN(songId)) {
      res.status(400).json({ error: "Invalid song ID" });
      return;
    }

    const result = likeService.toggleLike(req.userId!, songId);
    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.json({
      message: result.is_liked ? "Song liked" : "Song unliked",
      is_liked: result.is_liked,
    });
  }

  likeSong(req: AuthRequest, res: Response): void {
    const songId = parseInt(req.params.songId);
    if (isNaN(songId)) {
      res.status(400).json({ error: "Invalid song ID" });
      return;
    }

    const result = likeService.likeSong(req.userId!, songId);
    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.json({ message: "Song liked" });
  }

  unlikeSong(req: AuthRequest, res: Response): void {
    const songId = parseInt(req.params.songId);
    if (isNaN(songId)) {
      res.status(400).json({ error: "Invalid song ID" });
      return;
    }

    const result = likeService.unlikeSong(req.userId!, songId);
    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.json({ message: "Song unliked" });
  }
}

export const likeController = new LikeController();
