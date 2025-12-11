import type { Response } from "express";
import { userRepository } from "../repositories/user.repository.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export class UserController {
  getProfile(req: AuthRequest, res: Response): void {
    try {
      const userId = parseInt(req.params.userId);
      const profile = userRepository.getUserProfile(userId);

      if (!profile) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Remove password from response
      const { password, ...userProfile } = profile;

      res.json({ user: userProfile });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}

export const userController = new UserController();
