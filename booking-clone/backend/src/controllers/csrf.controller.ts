import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { csrfService } from "../services/index.js";

export class CsrfController {
  getToken(req: AuthRequest, res: Response): void {
    const token = csrfService.generateToken(req.userId!);
    res.json({ csrfToken: token });
  }
}

export const csrfController = new CsrfController();
