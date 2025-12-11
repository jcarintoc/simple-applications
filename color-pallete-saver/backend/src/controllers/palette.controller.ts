import type { Response } from "express";
import { paletteService, csrfService } from "../services/index.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export class PaletteController {
  getAll(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const palettes = paletteService.getByUserId(userId);
    res.json({ palettes });
  }

  getOne(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const paletteId = parseInt(req.params.id, 10);

    if (isNaN(paletteId)) {
      res.status(400).json({ error: "Invalid palette ID" });
      return;
    }

    const palette = paletteService.getById(paletteId, userId);
    if (!palette) {
      res.status(404).json({ error: "Palette not found" });
      return;
    }

    res.json({ palette });
  }

  create(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const { name, colors } = req.body;

    if (!name || !colors) {
      res.status(400).json({ error: "Name and colors are required" });
      return;
    }

    try {
      const palette = paletteService.create(userId, { name, colors });
      res.status(201).json({ message: "Palette created", palette });
    } catch (error) {
      this.handleError(res, error, "Failed to create palette");
    }
  }

  update(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const paletteId = parseInt(req.params.id, 10);
    const { name, colors } = req.body;

    if (isNaN(paletteId)) {
      res.status(400).json({ error: "Invalid palette ID" });
      return;
    }

    if (!name && !colors) {
      res.status(400).json({ error: "Name or colors required for update" });
      return;
    }

    try {
      const palette = paletteService.update(paletteId, userId, { name, colors });
      if (!palette) {
        res.status(404).json({ error: "Palette not found" });
        return;
      }

      res.json({ message: "Palette updated", palette });
    } catch (error) {
      this.handleError(res, error, "Failed to update palette");
    }
  }

  delete(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const paletteId = parseInt(req.params.id, 10);
    const csrfToken = req.headers["x-csrf-token"] as string;

    if (isNaN(paletteId)) {
      res.status(400).json({ error: "Invalid palette ID" });
      return;
    }

    // Validate CSRF token for delete operations
    if (!csrfService.validateToken(userId, csrfToken)) {
      res.status(403).json({ error: "Invalid or expired CSRF token" });
      return;
    }

    const success = paletteService.delete(paletteId, userId);
    if (!success) {
      res.status(404).json({ error: "Palette not found" });
      return;
    }

    res.json({ message: "Palette deleted" });
  }

  // Generate a new CSRF token for delete operations
  getCsrfToken(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const token = csrfService.generateToken(userId);
    res.json({ csrfToken: token });
  }

  private handleError(res: Response, error: unknown, fallbackMessage: string): void {
    const message = error instanceof Error ? error.message : fallbackMessage;
    const validationErrors = [
      "Colors must be a non-empty array",
      "Maximum 10 colors per palette",
      "Invalid hex color",
      "Palette name is required",
      "Palette name must be 50 characters or less",
    ];

    if (validationErrors.some((err) => message.includes(err))) {
      res.status(400).json({ error: message });
      return;
    }

    console.error(`${fallbackMessage}:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const paletteController = new PaletteController();

