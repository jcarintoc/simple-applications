import type { Response } from "express";
import { z } from "zod";
import { passwordService } from "../services/index.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

// Validation schemas
const generatePasswordSchema = z.object({
  length: z.number().min(4).max(128),
  hasUppercase: z.boolean(),
  hasLowercase: z.boolean(),
  hasNumbers: z.boolean(),
  hasSymbols: z.boolean(),
}).refine(
  (data) => data.hasUppercase || data.hasLowercase || data.hasNumbers || data.hasSymbols,
  { message: "At least one character type must be selected" }
);

const savePasswordSchema = z.object({
  password: z.string().min(1),
  label: z.string().max(100).optional(),
  length: z.number().min(4).max(128),
  hasUppercase: z.boolean(),
  hasLowercase: z.boolean(),
  hasNumbers: z.boolean(),
  hasSymbols: z.boolean(),
});

export class PasswordController {
  // Generate password - no auth required
  generate(req: AuthRequest, res: Response): void {
    try {
      const validation = generatePasswordSchema.safeParse(req.body);
      
      if (!validation.success) {
        res.status(400).json({ 
          error: "Validation failed", 
          details: validation.error.errors 
        });
        return;
      }

      const password = passwordService.generatePassword(validation.data);
      res.json({ password });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate password" });
    }
  }

  // Get saved passwords - auth required
  getSaved(req: AuthRequest, res: Response): void {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const passwords = passwordService.getSavedPasswords(userId);
      res.json({ passwords });
    } catch (error) {
      res.status(500).json({ error: "Failed to get saved passwords" });
    }
  }

  // Save password - auth required
  save(req: AuthRequest, res: Response): void {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const validation = savePasswordSchema.safeParse(req.body);
      
      if (!validation.success) {
        res.status(400).json({ 
          error: "Validation failed", 
          details: validation.error.errors 
        });
        return;
      }

      const savedPassword = passwordService.savePassword(userId, validation.data);
      res.status(201).json({ password: savedPassword });
    } catch (error) {
      res.status(500).json({ error: "Failed to save password" });
    }
  }

  // Delete password - auth + CSRF required
  delete(req: AuthRequest, res: Response): void {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid password ID" });
        return;
      }

      const deleted = passwordService.deletePassword(id, userId);
      
      if (!deleted) {
        res.status(404).json({ error: "Password not found" });
        return;
      }

      res.json({ message: "Password deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete password" });
    }
  }

  // Delete all passwords - auth + CSRF required
  deleteAll(req: AuthRequest, res: Response): void {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const count = passwordService.deleteAllPasswords(userId);
      res.json({ message: `Deleted ${count} password(s) successfully` });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete passwords" });
    }
  }
}

export const passwordController = new PasswordController();

