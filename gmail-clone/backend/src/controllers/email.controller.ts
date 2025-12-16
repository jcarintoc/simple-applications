import type { Request, Response } from "express";
import { emailService } from "../services/email.service.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import type { SendEmailDto, EmailFolder } from "../types/index.js";

export class EmailController {
  getEmails(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const folder = (req.query.folder as EmailFolder) || "inbox";

    if (!["inbox", "sent", "archive", "trash"].includes(folder)) {
      res.status(400).json({ error: "Invalid folder" });
      return;
    }

    try {
      const emails = emailService.getEmailsByFolder(userId, folder);
      res.json({ emails });
    } catch (error) {
      console.error("Error fetching emails:", error);
      res.status(500).json({ error: "Failed to fetch emails" });
    }
  }

  getEmailById(req: AuthRequest, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const userId = req.userId!;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid email ID" });
      return;
    }

    try {
      const email = emailService.getEmailById(id, userId);

      if (!email) {
        res.status(404).json({ error: "Email not found" });
        return;
      }

      res.json({ email });
    } catch (error) {
      console.error("Error fetching email:", error);
      res.status(500).json({ error: "Failed to fetch email" });
    }
  }

  sendEmail(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const { to_email, subject, body }: SendEmailDto = req.body;

    if (!to_email || !subject || !body) {
      res.status(400).json({ error: "to_email, subject, and body are required" });
      return;
    }

    try {
      const email = emailService.sendEmail(userId, { to_email, subject, body });
      res.status(201).json({ email });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send email";
      const status = message.includes("not found") || message.includes("yourself") ? 400 : 500;
      res.status(status).json({ error: message });
    }
  }

  markAsRead(req: AuthRequest, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const userId = req.userId!;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid email ID" });
      return;
    }

    try {
      const success = emailService.markAsRead(id, userId);
      if (!success) {
        res.status(404).json({ error: "Email not found or unauthorized" });
        return;
      }
      res.json({ message: "Email marked as read" });
    } catch (error) {
      console.error("Error marking email as read:", error);
      res.status(500).json({ error: "Failed to mark email as read" });
    }
  }

  markAsUnread(req: AuthRequest, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const userId = req.userId!;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid email ID" });
      return;
    }

    try {
      const success = emailService.markAsUnread(id, userId);
      if (!success) {
        res.status(404).json({ error: "Email not found or unauthorized" });
        return;
      }
      res.json({ message: "Email marked as unread" });
    } catch (error) {
      console.error("Error marking email as unread:", error);
      res.status(500).json({ error: "Failed to mark email as unread" });
    }
  }

  archive(req: AuthRequest, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const userId = req.userId!;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid email ID" });
      return;
    }

    try {
      const success = emailService.archive(id, userId);
      if (!success) {
        res.status(404).json({ error: "Email not found or unauthorized" });
        return;
      }
      res.json({ message: "Email archived" });
    } catch (error) {
      console.error("Error archiving email:", error);
      res.status(500).json({ error: "Failed to archive email" });
    }
  }

  unarchive(req: AuthRequest, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const userId = req.userId!;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid email ID" });
      return;
    }

    try {
      const success = emailService.unarchive(id, userId);
      if (!success) {
        res.status(404).json({ error: "Email not found or unauthorized" });
        return;
      }
      res.json({ message: "Email unarchived" });
    } catch (error) {
      console.error("Error unarchiving email:", error);
      res.status(500).json({ error: "Failed to unarchive email" });
    }
  }

  deleteEmail(req: AuthRequest, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const userId = req.userId!;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid email ID" });
      return;
    }

    try {
      const success = emailService.moveToTrash(id, userId);
      if (!success) {
        res.status(404).json({ error: "Email not found or unauthorized" });
        return;
      }
      res.json({ message: "Email moved to trash" });
    } catch (error) {
      console.error("Error deleting email:", error);
      res.status(500).json({ error: "Failed to delete email" });
    }
  }

  restore(req: AuthRequest, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const userId = req.userId!;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid email ID" });
      return;
    }

    try {
      const success = emailService.restore(id, userId);
      if (!success) {
        res.status(404).json({ error: "Email not found or unauthorized" });
        return;
      }
      res.json({ message: "Email restored" });
    } catch (error) {
      console.error("Error restoring email:", error);
      res.status(500).json({ error: "Failed to restore email" });
    }
  }

  permanentDelete(req: AuthRequest, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const userId = req.userId!;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid email ID" });
      return;
    }

    try {
      const success = emailService.permanentDelete(id, userId);
      if (!success) {
        res.status(404).json({ error: "Email not found or unauthorized" });
        return;
      }
      res.json({ message: "Email permanently deleted" });
    } catch (error) {
      console.error("Error permanently deleting email:", error);
      res.status(500).json({ error: "Failed to permanently delete email" });
    }
  }

  getUnreadCount(req: AuthRequest, res: Response): void {
    const userId = req.userId!;

    try {
      const count = emailService.getUnreadCount(userId);
      res.json({ count });
    } catch (error) {
      console.error("Error fetching unread count:", error);
      res.status(500).json({ error: "Failed to fetch unread count" });
    }
  }
}

export const emailController = new EmailController();