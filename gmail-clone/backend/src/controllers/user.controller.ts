import type { Request, Response } from "express";
import { userRepository } from "../repositories/index.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export class UserController {
  search(req: AuthRequest, res: Response): void {
    const query = req.query.q as string;

    if (!query || query.trim().length === 0) {
      res.json({ users: [] });
      return;
    }

    try {
      // Search users by email (simple LIKE search)
      const users = userRepository.search(query.trim());
      res.json({ users: users.map((u) => ({ id: u.id, email: u.email, name: u.name })) });
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({ error: "Failed to search users" });
    }
  }
}

export const userController = new UserController();