import type { Request, Response } from "express";
import { songService } from "../services/index.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export class SongController {
  getAll(req: Request, res: Response): void {
    const userId = (req as AuthRequest).userId || null;
    const songs = songService.getAllSongs(userId);
    res.json({ songs });
  }

  search(req: Request, res: Response): void {
    const query = req.query.q as string;
    if (!query) {
      res.status(400).json({ error: "Search query is required" });
      return;
    }

    const userId = (req as AuthRequest).userId || null;
    const songs = songService.searchSongs(query, userId);
    res.json({ songs });
  }

  getById(req: Request, res: Response): void {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid song ID" });
      return;
    }

    const song = songService.getSongById(id);
    if (!song) {
      res.status(404).json({ error: "Song not found" });
      return;
    }

    res.json({ song });
  }
}

export const songController = new SongController();
