import type { Response } from "express";
import { bookmarkService } from "../services/index.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import type { CreateBookmarkDto, UpdateBookmarkDto, BookmarkFilters } from "../types/index.js";

export class BookmarkController {
  getBookmarks(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const filters: BookmarkFilters = {
      search: req.query.search as string | undefined,
      tags: req.query.tags ? (req.query.tags as string).split(",") : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    };

    try {
      const result = bookmarkService.getBookmarks(userId, filters);
      res.json(result);
    } catch (error) {
      this.handleError(res, error, "Failed to fetch bookmarks");
    }
  }

  getBookmarkById(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid bookmark ID" });
      return;
    }

    try {
      const bookmark = bookmarkService.getBookmarkById(id, userId);
      if (!bookmark) {
        res.status(404).json({ error: "Bookmark not found" });
        return;
      }
      res.json({ bookmark });
    } catch (error) {
      this.handleError(res, error, "Failed to fetch bookmark");
    }
  }

  createBookmark(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const data: CreateBookmarkDto = req.body;

    if (!data.url || !data.title) {
      res.status(400).json({ error: "URL and title are required" });
      return;
    }

    try {
      const bookmark = bookmarkService.createBookmark(userId, data);
      res.status(201).json({ message: "Bookmark created successfully", bookmark });
    } catch (error) {
      this.handleError(res, error, "Failed to create bookmark");
    }
  }

  updateBookmark(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const id = parseInt(req.params.id);
    const data: UpdateBookmarkDto = req.body;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid bookmark ID" });
      return;
    }

    try {
      const bookmark = bookmarkService.updateBookmark(id, userId, data);
      if (!bookmark) {
        res.status(404).json({ error: "Bookmark not found" });
        return;
      }
      res.json({ message: "Bookmark updated successfully", bookmark });
    } catch (error) {
      this.handleError(res, error, "Failed to update bookmark");
    }
  }

  deleteBookmark(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid bookmark ID" });
      return;
    }

    try {
      const success = bookmarkService.deleteBookmark(id, userId);
      if (!success) {
        res.status(404).json({ error: "Bookmark not found" });
        return;
      }
      res.json({ message: "Bookmark deleted successfully" });
    } catch (error) {
      this.handleError(res, error, "Failed to delete bookmark");
    }
  }

  getTags(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    try {
      const tags = bookmarkService.getAllTags(userId);
      res.json({ tags });
    } catch (error) {
      this.handleError(res, error, "Failed to fetch tags");
    }
  }

  private handleError(res: Response, error: unknown, fallbackMessage: string): void {
    const message = error instanceof Error ? error.message : fallbackMessage;
    const knownErrors: Record<string, number> = {
      "Invalid URL format": 400,
      "Title is required": 400,
      "Title must be less than 255 characters": 400,
    };

    if (knownErrors[message]) {
      res.status(knownErrors[message]).json({ error: message });
      return;
    }

    console.error(`${fallbackMessage}:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const bookmarkController = new BookmarkController();
