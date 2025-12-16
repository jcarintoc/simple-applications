import { connectionRepository } from "../repositories/connection.repository.js";
import { userRepository } from "../repositories/user.repository.js";
import { profileRepository } from "../repositories/profile.repository.js";
import type { ConnectionResponse, ConnectionRequestResponse, ConnectionStatusResponse } from "../types/index.js";

export class ConnectionService {
  sendRequest(requesterId: number, recipientId: number): { id: number; status: string } {
    if (requesterId === recipientId) {
      throw new Error("Cannot connect with yourself");
    }

    const existingConnection = connectionRepository.findBetweenUsers(requesterId, recipientId);
    if (existingConnection) {
      throw new Error("Connection already exists");
    }

    const recipient = userRepository.findById(recipientId);
    if (!recipient) {
      throw new Error("User not found");
    }

    const id = connectionRepository.create(requesterId, recipientId);
    return { id, status: "pending" };
  }

  acceptRequest(connectionId: number, userId: number): void {
    const connection = connectionRepository.findById(connectionId);

    if (!connection) {
      throw new Error("Connection not found");
    }

    if (connection.recipient_id !== userId) {
      throw new Error("Unauthorized");
    }

    if (connection.status !== "pending") {
      throw new Error("Connection is not pending");
    }

    connectionRepository.updateStatus(connectionId, "accepted");
  }

  rejectRequest(connectionId: number, userId: number): void {
    const connection = connectionRepository.findById(connectionId);

    if (!connection) {
      throw new Error("Connection not found");
    }

    if (connection.recipient_id !== userId) {
      throw new Error("Unauthorized");
    }

    connectionRepository.updateStatus(connectionId, "rejected");
  }

  getConnections(userId: number): ConnectionResponse[] {
    const connections = connectionRepository.findAcceptedByUserId(userId);

    return connections.map(conn => {
      const otherUserId = conn.requester_id === userId ? conn.recipient_id : conn.requester_id;
      const user = userRepository.findById(otherUserId)!;
      const profile = profileRepository.findByUserId(otherUserId);

      return {
        id: conn.id,
        user_id: otherUserId,
        name: user.name,
        headline: profile?.headline || null,
        profile_image_url: profile?.profile_image_url || null,
        connected_at: conn.updated_at
      };
    });
  }

  getPendingRequests(userId: number): ConnectionRequestResponse[] {
    const requests = connectionRepository.findPendingReceivedByUserId(userId);

    return requests.map(req => {
      const requester = userRepository.findById(req.requester_id)!;
      const profile = profileRepository.findByUserId(req.requester_id);

      return {
        id: req.id,
        requester_id: req.requester_id,
        requester_name: requester.name,
        requester_headline: profile?.headline || null,
        requester_profile_image_url: profile?.profile_image_url || null,
        created_at: req.created_at
      };
    });
  }

  getSentRequests(userId: number): ConnectionRequestResponse[] {
    const requests = connectionRepository.findPendingSentByUserId(userId);

    return requests.map(req => {
      const recipient = userRepository.findById(req.recipient_id)!;
      const profile = profileRepository.findByUserId(req.recipient_id);

      return {
        id: req.id,
        requester_id: req.recipient_id,
        requester_name: recipient.name,
        requester_headline: profile?.headline || null,
        requester_profile_image_url: profile?.profile_image_url || null,
        created_at: req.created_at
      };
    });
  }

  getConnectionStatus(userId: number, otherUserId: number): ConnectionStatusResponse {
    if (userId === otherUserId) {
      return { status: "self" };
    }

    const connection = connectionRepository.findBetweenUsers(userId, otherUserId);

    if (!connection) {
      return { status: "none" };
    }

    if (connection.status === "accepted") {
      return { status: "connected", connection_id: connection.id };
    }

    if (connection.requester_id === userId) {
      return { status: "pending_sent", connection_id: connection.id };
    }

    return { status: "pending_received", connection_id: connection.id };
  }

  removeConnection(connectionId: number, userId: number): void {
    const connection = connectionRepository.findById(connectionId);

    if (!connection) {
      throw new Error("Connection not found");
    }

    if (connection.requester_id !== userId && connection.recipient_id !== userId) {
      throw new Error("Unauthorized");
    }

    connectionRepository.delete(connectionId);
  }
}

export const connectionService = new ConnectionService();
