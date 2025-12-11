import type { Response } from "express";
import { followService } from "../services/follow.service.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export class FollowController {
  follow(req: AuthRequest, res: Response): void {
    try {
      const followingId = parseInt(req.params.userId);
      const result = followService.follow(req.userId!, followingId);

      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  unfollow(req: AuthRequest, res: Response): void {
    try {
      const followingId = parseInt(req.params.userId);
      const result = followService.unfollow(req.userId!, followingId);

      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  getFollowers(req: AuthRequest, res: Response): void {
    try {
      const userId = parseInt(req.params.userId);
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const followers = followService.getFollowers(userId, limit, offset);

      res.json({ followers });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  getFollowing(req: AuthRequest, res: Response): void {
    try {
      const userId = parseInt(req.params.userId);
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const following = followService.getFollowing(userId, limit, offset);

      res.json({ following });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  checkFollowing(req: AuthRequest, res: Response): void {
    try {
      const userId = parseInt(req.params.userId);
      const isFollowing = followService.checkFollowing(req.userId!, userId);

      res.json({ isFollowing });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}

export const followController = new FollowController();
