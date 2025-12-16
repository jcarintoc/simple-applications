import type { Response } from "express";
import { followService } from "../services/index.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export class FollowController {
  follow(req: AuthRequest, res: Response): void {
    const followingId = parseInt(req.params.userId, 10);

    if (isNaN(followingId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    try {
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
    const followingId = parseInt(req.params.userId, 10);

    if (isNaN(followingId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    try {
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

  getFollowing(req: Request, res: Response): void {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    try {
      const following = followService.getFollowing(userId);
      res.json({ following });
    } catch (error) {
      console.error("Error fetching following:", error);
      res.status(500).json({ error: "Failed to fetch following" });
    }
  }

  getFollowers(req: Request, res: Response): void {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    try {
      const followers = followService.getFollowers(userId);
      res.json({ followers });
    } catch (error) {
      console.error("Error fetching followers:", error);
      res.status(500).json({ error: "Failed to fetch followers" });
    }
  }

  checkFollowing(req: AuthRequest, res: Response): void {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    try {
      const isFollowing = followService.isFollowing(req.userId!, userId);
      res.json({ isFollowing });
    } catch (error) {
      console.error("Error checking follow status:", error);
      res.status(500).json({ error: "Failed to check follow status" });
    }
  }
}

export const followController = new FollowController();
