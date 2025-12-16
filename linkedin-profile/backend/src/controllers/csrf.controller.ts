import type { Request, Response } from "express";

export class CsrfController {
  getCsrfToken(req: Request, res: Response): void {
    res.json({ message: "CSRF token set" });
  }
}

export const csrfController = new CsrfController();
