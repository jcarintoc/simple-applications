import type { Response } from "express";
import { watchlistService } from "../services/index.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export class WatchlistController {
  getWatchlist(req: AuthRequest, res: Response): void {
    const titles = watchlistService.getWatchlist(req.userId!);
    res.json({ titles });
  }

  toggleWatchlist(req: AuthRequest, res: Response): void {
    const titleId = parseInt(req.params.titleId);
    if (isNaN(titleId)) {
      res.status(400).json({ error: "Invalid title ID" });
      return;
    }

    const result = watchlistService.toggleWatchlist(req.userId!, titleId);
    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.json({
      message: result.in_watchlist ? "Added to watchlist" : "Removed from watchlist",
      in_watchlist: result.in_watchlist,
    });
  }

  addToWatchlist(req: AuthRequest, res: Response): void {
    const titleId = parseInt(req.params.titleId);
    if (isNaN(titleId)) {
      res.status(400).json({ error: "Invalid title ID" });
      return;
    }

    const result = watchlistService.addToWatchlist(req.userId!, titleId);
    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.json({ message: "Added to watchlist" });
  }

  removeFromWatchlist(req: AuthRequest, res: Response): void {
    const titleId = parseInt(req.params.titleId);
    if (isNaN(titleId)) {
      res.status(400).json({ error: "Invalid title ID" });
      return;
    }

    const result = watchlistService.removeFromWatchlist(req.userId!, titleId);
    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.json({ message: "Removed from watchlist" });
  }
}

export const watchlistController = new WatchlistController();
