import type { Response } from "express";
import { likeService } from "../services/like.service.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export class LikeController {
  like(req: AuthRequest, res: Response): void {
    try {
      const postId = parseInt(req.params.postId);
      const result = likeService.like(req.userId!, postId);

      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  unlike(req: AuthRequest, res: Response): void {
    try {
      const postId = parseInt(req.params.postId);
      const result = likeService.unlike(req.userId!, postId);

      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  getPostLikes(req: AuthRequest, res: Response): void {
    try {
      const postId = parseInt(req.params.postId);
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const users = likeService.getPostLikes(postId, limit, offset);

      res.json({ users });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}

export const likeController = new LikeController();
