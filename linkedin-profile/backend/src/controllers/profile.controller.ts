import type { Request, Response } from "express";
import { profileService } from "../services/profile.service.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export class ProfileController {
  getProfile(req: Request, res: Response): void {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    try {
      const profile = profileService.getProfile(userId);
      res.json({ profile });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to get profile";
      if (message === "User not found") {
        res.status(404).json({ error: message });
        return;
      }
      console.error("Error getting profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  getMyProfile(req: AuthRequest, res: Response): void {
    const userId = req.userId!;

    try {
      const profile = profileService.getProfile(userId);
      res.json({ profile });
    } catch (error) {
      console.error("Error getting profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  updateMyProfile(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const data = req.body;

    // Validate the data
    const allowedFields = ["headline", "summary", "location", "industry", "profile_image_url", "banner_image_url"];
    const updateData: Record<string, string> = {};

    for (const key of allowedFields) {
      if (key in data) {
        if (typeof data[key] === "string") {
          updateData[key] = data[key];
        } else {
          res.status(400).json({ error: `${key} must be a string` });
          return;
        }
      }
    }

    try {
      const profile = profileService.updateProfile(userId, updateData);
      res.json({ message: "Profile updated successfully", profile });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update profile";
      console.error("Error updating profile:", error);
      res.status(500).json({ error: message });
    }
  }

  getSuggestedUsers(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;

    try {
      const suggestedUsers = profileService.getSuggestedUsers(userId, limit);
      res.json({ users: suggestedUsers });
    } catch (error) {
      console.error("Error getting suggested users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export const profileController = new ProfileController();
