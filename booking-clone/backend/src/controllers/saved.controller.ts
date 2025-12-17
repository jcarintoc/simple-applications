import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { savedService } from "../services/index.js";

export class SavedController {
  toggle(req: AuthRequest, res: Response): void {
    const { hotelId } = req.body;

    if (!hotelId) {
      res.status(400).json({ error: "Hotel ID required" });
      return;
    }

    try {
      const result = savedService.toggle(req.userId!, hotelId);
      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed";
      res.status(400).json({ error: message });
    }
  }

  getUserSaved(req: AuthRequest, res: Response): void {
    const saved = savedService.getUserSaved(req.userId!);
    res.json({ saved });
  }

  checkSaved(req: AuthRequest, res: Response): void {
    const hotelId = parseInt(req.params.hotelId);
    const saved = savedService.isSaved(req.userId!, hotelId);
    res.json({ saved });
  }
}

export const savedController = new SavedController();
