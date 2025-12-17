import type { Response } from "express";
import { continueWatchingService } from "../services/index.js";
import type { SessionRequest } from "../middleware/session.middleware.js";

export class ContinueWatchingController {
  getContinueWatching(req: SessionRequest, res: Response): void {
    const items = continueWatchingService.getContinueWatching(req.sessionId!);
    res.json({ items });
  }

  updateProgress(req: SessionRequest, res: Response): void {
    const titleId = parseInt(req.params.titleId);
    if (isNaN(titleId)) {
      res.status(400).json({ error: "Invalid title ID" });
      return;
    }

    const { progress_percent } = req.body;
    if (typeof progress_percent !== "number" || progress_percent < 0 || progress_percent > 100) {
      res.status(400).json({ error: "Progress must be a number between 0 and 100" });
      return;
    }

    const result = continueWatchingService.updateProgress(req.sessionId!, titleId, progress_percent);
    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.json({
      message: "Progress updated",
      progress: result.progress,
    });
  }

  removeFromContinueWatching(req: SessionRequest, res: Response): void {
    const titleId = parseInt(req.params.titleId);
    if (isNaN(titleId)) {
      res.status(400).json({ error: "Invalid title ID" });
      return;
    }

    const result = continueWatchingService.removeFromContinueWatching(req.sessionId!, titleId);
    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.json({ message: "Removed from continue watching" });
  }

  clearContinueWatching(req: SessionRequest, res: Response): void {
    const result = continueWatchingService.clearContinueWatching(req.sessionId!);
    res.json({ message: `Cleared ${result.cleared} items` });
  }
}

export const continueWatchingController = new ContinueWatchingController();
