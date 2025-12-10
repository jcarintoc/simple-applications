import { Request, Response } from "express";
import { generateCsrfToken } from "../middleware/csrf.middleware.js";

export const getCsrfToken = (req: Request, res: Response): void => {
  const user = (req as Request & { user?: { id: number } }).user;

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = generateCsrfToken(user.id);
  res.json({ token });
};
