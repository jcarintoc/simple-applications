import type { Response } from "express";
import { favoriteService } from "../services/favorite.service.js";
import type { CSRFRequest } from "../middleware/csrf.middleware.js";
import type { CreateFavoriteDto, UpdateFavoriteDto } from "../types/index.js";

export class FavoriteController {
  getAll(req: CSRFRequest, res: Response): void {
    const userId = req.userId!;
    try {
      const favorites = favoriteService.findAllByUserId(userId);
      res.json({ favorites });
    } catch (error) {
      this.handleError(res, error, "Failed to fetch favorites");
    }
  }

  create(req: CSRFRequest, res: Response): void {
    const userId = req.userId!;
    const { name, category } = req.body as CreateFavoriteDto;

    if (!name || !category) {
      res.status(400).json({ error: "Name and category are required" });
      return;
    }

    try {
      const favorite = favoriteService.create(userId, { name, category });
      res.status(201).json({ favorite });
    } catch (error) {
      this.handleError(res, error, "Failed to create favorite");
    }
  }

  update(req: CSRFRequest, res: Response): void {
    const userId = req.userId!;
    const id = parseInt(req.params.id, 10);
    const { name, category } = req.body as UpdateFavoriteDto;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid favorite ID" });
      return;
    }

    if (!name && !category) {
      res.status(400).json({ error: "At least one field (name or category) is required" });
      return;
    }

    try {
      const favorite = favoriteService.update(id, userId, { name, category });
      res.json({ favorite });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update favorite";
      if (message.includes("not found") || message.includes("access denied")) {
        res.status(404).json({ error: message });
        return;
      }
      this.handleError(res, error, "Failed to update favorite");
    }
  }

  delete(req: CSRFRequest, res: Response): void {
    const userId = req.userId!;
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid favorite ID" });
      return;
    }

    try {
      favoriteService.delete(id, userId);
      res.json({ message: "Favorite deleted successfully" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete favorite";
      if (message.includes("not found") || message.includes("access denied")) {
        res.status(404).json({ error: message });
        return;
      }
      this.handleError(res, error, "Failed to delete favorite");
    }
  }

  private handleError(res: Response, error: unknown, fallbackMessage: string): void {
    console.error(`${fallbackMessage}:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const favoriteController = new FavoriteController();

