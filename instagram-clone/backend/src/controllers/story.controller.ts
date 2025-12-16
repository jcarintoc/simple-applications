import type { Request, Response } from "express";
import { storyService } from "../services/index.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export class StoryController {
  getActive(req: AuthRequest, res: Response): void {
    try {
      const stories = storyService.getActive();
      res.json({ stories });
    } catch (error) {
      console.error("Error fetching stories:", error);
      res.status(500).json({ error: "Failed to fetch stories" });
    }
  }

  getByUser(req: Request, res: Response): void {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    try {
      const stories = storyService.getByUser(userId);
      res.json({ stories });
    } catch (error) {
      console.error("Error fetching stories:", error);
      res.status(500).json({ error: "Failed to fetch stories" });
    }
  }
}

export const storyController = new StoryController();
