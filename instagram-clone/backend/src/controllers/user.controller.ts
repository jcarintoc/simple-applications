import type { Request, Response } from "express";
import { userRepository } from "../repositories/index.js";

export class UserController {
  search(req: Request, res: Response): void {
    const query = req.query.q as string | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

    if (!query || query.trim().length === 0) {
      res.status(400).json({ error: "Search query is required" });
      return;
    }

    try {
      const users = userRepository.search(query.trim(), limit);
      // Remove password from response
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json({ users: safeUsers });
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({ error: "Failed to search users" });
    }
  }
}

export const userController = new UserController();
