import type { Request, Response } from "express";
import { subredditService } from "../services/index.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import type { CreateSubredditDto, UpdateSubredditDto } from "../types/index.js";

export class SubredditController {
  getAll(req: Request, res: Response): void {
    try {
      const subreddits = subredditService.getAll();
      res.json({ subreddits });
    } catch (error) {
      console.error("Error fetching subreddits:", error);
      res.status(500).json({ error: "Failed to fetch subreddits" });
    }
  }

  getById(req: Request, res: Response): void {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid subreddit ID" });
      return;
    }

    try {
      const subreddit = subredditService.getById(id);
      if (!subreddit) {
        res.status(404).json({ error: "Subreddit not found" });
        return;
      }
      res.json({ subreddit });
    } catch (error) {
      console.error("Error fetching subreddit:", error);
      res.status(500).json({ error: "Failed to fetch subreddit" });
    }
  }

  create(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const data: CreateSubredditDto = req.body;

    if (!data.name || !data.description) {
      res.status(400).json({ error: "Name and description are required" });
      return;
    }

    try {
      const subreddit = subredditService.create(userId, data);
      res.status(201).json({ subreddit });
    } catch (error) {
      console.error("Error creating subreddit:", error);
      const message = error instanceof Error ? error.message : "Failed to create subreddit";
      res.status(400).json({ error: message });
    }
  }

  update(req: AuthRequest, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const userId = req.userId!;
    const data: UpdateSubredditDto = req.body;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid subreddit ID" });
      return;
    }

    try {
      const subreddit = subredditService.update(id, userId, data);
      res.json({ subreddit });
    } catch (error) {
      console.error("Error updating subreddit:", error);
      const message = error instanceof Error ? error.message : "Failed to update subreddit";
      const status = message.includes("not found") || message.includes("permission") ? 404 : 400;
      res.status(status).json({ error: message });
    }
  }

  delete(req: AuthRequest, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const userId = req.userId!;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid subreddit ID" });
      return;
    }

    try {
      const success = subredditService.delete(id, userId);
      if (!success) {
        res.status(404).json({ error: "Subreddit not found" });
        return;
      }
      res.json({ message: "Subreddit deleted successfully" });
    } catch (error) {
      console.error("Error deleting subreddit:", error);
      const message = error instanceof Error ? error.message : "Failed to delete subreddit";
      const status = message.includes("not found") || message.includes("permission") ? 404 : 400;
      res.status(status).json({ error: message });
    }
  }
}

export const subredditController = new SubredditController();

