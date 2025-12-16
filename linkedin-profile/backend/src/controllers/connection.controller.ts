import type { Request, Response } from "express";
import { connectionService } from "../services/connection.service.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export class ConnectionController {
  getConnections(req: AuthRequest, res: Response): void {
    const userId = req.userId!;

    try {
      const connections = connectionService.getConnections(userId);
      res.json({ connections });
    } catch (error) {
      console.error("Error getting connections:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  getPendingRequests(req: AuthRequest, res: Response): void {
    const userId = req.userId!;

    try {
      const requests = connectionService.getPendingRequests(userId);
      res.json({ requests });
    } catch (error) {
      console.error("Error getting pending requests:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  getSentRequests(req: AuthRequest, res: Response): void {
    const userId = req.userId!;

    try {
      const requests = connectionService.getSentRequests(userId);
      res.json({ requests });
    } catch (error) {
      console.error("Error getting sent requests:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  getConnectionStatus(req: Request, res: Response): void {
    const userId = (req as AuthRequest).userId!;
    const otherUserId = parseInt(req.params.userId);

    if (isNaN(otherUserId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    try {
      const status = connectionService.getConnectionStatus(userId, otherUserId);
      res.json(status);
    } catch (error) {
      console.error("Error getting connection status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  sendRequest(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const { recipient_id } = req.body;

    if (!recipient_id || typeof recipient_id !== "number") {
      res.status(400).json({ error: "Recipient ID is required" });
      return;
    }

    try {
      const connection = connectionService.sendRequest(userId, recipient_id);
      res.json({ message: "Connection request sent", connection });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send connection request";
      const knownErrors: Record<string, number> = {
        "Cannot connect with yourself": 400,
        "Connection already exists": 400,
        "User not found": 404
      };

      if (knownErrors[message]) {
        res.status(knownErrors[message]).json({ error: message });
        return;
      }

      console.error("Error sending connection request:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  acceptConnection(req: Request, res: Response): void {
    const userId = (req as AuthRequest).userId!;
    const connectionId = parseInt(req.params.id);

    if (isNaN(connectionId)) {
      res.status(400).json({ error: "Invalid connection ID" });
      return;
    }

    try {
      connectionService.acceptRequest(connectionId, userId);
      res.json({ message: "Connection accepted" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to accept connection";
      const knownErrors: Record<string, number> = {
        "Connection not found": 404,
        "Unauthorized": 403,
        "Connection is not pending": 400
      };

      if (knownErrors[message]) {
        res.status(knownErrors[message]).json({ error: message });
        return;
      }

      console.error("Error accepting connection:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  rejectConnection(req: Request, res: Response): void {
    const userId = (req as AuthRequest).userId!;
    const connectionId = parseInt(req.params.id);

    if (isNaN(connectionId)) {
      res.status(400).json({ error: "Invalid connection ID" });
      return;
    }

    try {
      connectionService.rejectRequest(connectionId, userId);
      res.json({ message: "Connection rejected" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to reject connection";
      const knownErrors: Record<string, number> = {
        "Connection not found": 404,
        "Unauthorized": 403
      };

      if (knownErrors[message]) {
        res.status(knownErrors[message]).json({ error: message });
        return;
      }

      console.error("Error rejecting connection:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  removeConnection(req: Request, res: Response): void {
    const userId = (req as AuthRequest).userId!;
    const connectionId = parseInt(req.params.id);

    if (isNaN(connectionId)) {
      res.status(400).json({ error: "Invalid connection ID" });
      return;
    }

    try {
      connectionService.removeConnection(connectionId, userId);
      res.json({ message: "Connection removed" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to remove connection";
      const knownErrors: Record<string, number> = {
        "Connection not found": 404,
        "Unauthorized": 403
      };

      if (knownErrors[message]) {
        res.status(knownErrors[message]).json({ error: message });
        return;
      }

      console.error("Error removing connection:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export const connectionController = new ConnectionController();
