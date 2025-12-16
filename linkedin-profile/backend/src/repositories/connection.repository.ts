import db from "../db/database.js";
import type { Connection } from "../types/index.js";

export class ConnectionRepository {
  findById(id: number): Connection | undefined {
    return db.prepare("SELECT * FROM connections WHERE id = ?").get(id) as Connection | undefined;
  }

  findBetweenUsers(userId1: number, userId2: number): Connection | undefined {
    return db.prepare(
      "SELECT * FROM connections WHERE (requester_id = ? AND recipient_id = ?) OR (requester_id = ? AND recipient_id = ?)"
    ).get(userId1, userId2, userId2, userId1) as Connection | undefined;
  }

  findAcceptedByUserId(userId: number): Connection[] {
    return db.prepare(
      "SELECT * FROM connections WHERE (requester_id = ? OR recipient_id = ?) AND status = 'accepted'"
    ).all(userId, userId) as Connection[];
  }

  findPendingReceivedByUserId(userId: number): Connection[] {
    return db.prepare(
      "SELECT * FROM connections WHERE recipient_id = ? AND status = 'pending'"
    ).all(userId) as Connection[];
  }

  findPendingSentByUserId(userId: number): Connection[] {
    return db.prepare(
      "SELECT * FROM connections WHERE requester_id = ? AND status = 'pending'"
    ).all(userId) as Connection[];
  }

  create(requesterId: number, recipientId: number): number {
    const result = db.prepare(
      "INSERT INTO connections (requester_id, recipient_id, status) VALUES (?, ?, 'pending')"
    ).run(requesterId, recipientId);
    return result.lastInsertRowid as number;
  }

  updateStatus(id: number, status: "accepted" | "rejected"): void {
    db.prepare("UPDATE connections SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .run(status, id);
  }

  delete(id: number): void {
    db.prepare("DELETE FROM connections WHERE id = ?").run(id);
  }
}

export const connectionRepository = new ConnectionRepository();
