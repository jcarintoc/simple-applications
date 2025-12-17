import type { Request, Response } from "express";
import { titleService } from "../services/index.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import type { TitleType } from "../types/index.js";

export class TitleController {
  getAll(req: Request, res: Response): void {
    const userId = (req as AuthRequest).userId || null;
    const typeFilter = req.query.type as TitleType | undefined;

    let titles;
    if (typeFilter && (typeFilter === "movie" || typeFilter === "show")) {
      titles = titleService.getTitlesByType(typeFilter, userId);
    } else {
      titles = titleService.getAllTitles(userId);
    }

    res.json({ titles });
  }

  search(req: Request, res: Response): void {
    const query = req.query.q as string;
    if (!query) {
      res.status(400).json({ error: "Search query is required" });
      return;
    }

    const userId = (req as AuthRequest).userId || null;
    const titles = titleService.searchTitles(query, userId);
    res.json({ titles });
  }

  getGenres(_req: Request, res: Response): void {
    const genres = titleService.getGenres();
    res.json({ genres });
  }
}

export const titleController = new TitleController();
