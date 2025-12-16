import db from "../db/database.js";
import type { Email, EmailWithUsers } from "../types/index.js";

export class EmailRepository {
  findById(id: number): Email | undefined {
    return db.prepare("SELECT * FROM emails WHERE id = ?").get(id) as Email | undefined;
  }

  findByIdWithUsers(id: number): EmailWithUsers | undefined {
    return db.prepare(`
      SELECT 
        e.*,
        fu.name as from_user_name,
        fu.email as from_user_email,
        tu.name as to_user_name,
        tu.email as to_user_email
      FROM emails e
      JOIN users fu ON e.from_user_id = fu.id
      JOIN users tu ON e.to_user_id = tu.id
      WHERE e.id = ?
    `).get(id) as EmailWithUsers | undefined;
  }

  findInbox(userId: number): EmailWithUsers[] {
    return db.prepare(`
      SELECT 
        e.*,
        fu.name as from_user_name,
        fu.email as from_user_email,
        tu.name as to_user_name,
        tu.email as to_user_email
      FROM emails e
      JOIN users fu ON e.from_user_id = fu.id
      JOIN users tu ON e.to_user_id = tu.id
      WHERE e.to_user_id = ? AND e.is_deleted = 0 AND (e.archived_by_recipient = 0 OR e.archived_by_recipient IS NULL)
      ORDER BY e.created_at DESC
    `).all(userId) as EmailWithUsers[];
  }

  findSent(userId: number): EmailWithUsers[] {
    return db.prepare(`
      SELECT 
        e.*,
        fu.name as from_user_name,
        fu.email as from_user_email,
        tu.name as to_user_name,
        tu.email as to_user_email
      FROM emails e
      JOIN users fu ON e.from_user_id = fu.id
      JOIN users tu ON e.to_user_id = tu.id
      WHERE e.from_user_id = ? AND e.is_deleted = 0 AND (e.archived_by_sender = 0 OR e.archived_by_sender IS NULL)
      ORDER BY e.created_at DESC
    `).all(userId) as EmailWithUsers[];
  }

  findArchived(userId: number): EmailWithUsers[] {
    return db.prepare(`
      SELECT 
        e.*,
        fu.name as from_user_name,
        fu.email as from_user_email,
        tu.name as to_user_name,
        tu.email as to_user_email
      FROM emails e
      JOIN users fu ON e.from_user_id = fu.id
      JOIN users tu ON e.to_user_id = tu.id
      WHERE ((e.to_user_id = ? AND e.archived_by_recipient = 1) OR (e.from_user_id = ? AND e.archived_by_sender = 1)) 
        AND e.is_deleted = 0
      ORDER BY e.created_at DESC
    `).all(userId, userId) as EmailWithUsers[];
  }

  findTrash(userId: number): EmailWithUsers[] {
    return db.prepare(`
      SELECT 
        e.*,
        fu.name as from_user_name,
        fu.email as from_user_email,
        tu.name as to_user_name,
        tu.email as to_user_email
      FROM emails e
      JOIN users fu ON e.from_user_id = fu.id
      JOIN users tu ON e.to_user_id = tu.id
      WHERE (e.to_user_id = ? OR e.from_user_id = ?) AND e.is_deleted = 1
      ORDER BY e.created_at DESC
    `).all(userId, userId) as EmailWithUsers[];
  }

  create(fromUserId: number, toUserId: number, subject: string, body: string): number {
    const result = db.prepare(`
      INSERT INTO emails (from_user_id, to_user_id, subject, body)
      VALUES (?, ?, ?, ?)
    `).run(fromUserId, toUserId, subject, body);
    return result.lastInsertRowid as number;
  }

  markAsRead(id: number): boolean {
    const result = db.prepare("UPDATE emails SET is_read = 1 WHERE id = ?").run(id);
    return result.changes > 0;
  }

  markAsUnread(id: number): boolean {
    const result = db.prepare("UPDATE emails SET is_read = 0 WHERE id = ?").run(id);
    return result.changes > 0;
  }

  archiveBySender(id: number): boolean {
    const result = db.prepare("UPDATE emails SET archived_by_sender = 1 WHERE id = ?").run(id);
    return result.changes > 0;
  }

  archiveByRecipient(id: number): boolean {
    const result = db.prepare("UPDATE emails SET archived_by_recipient = 1 WHERE id = ?").run(id);
    return result.changes > 0;
  }

  unarchiveBySender(id: number): boolean {
    const result = db.prepare("UPDATE emails SET archived_by_sender = 0 WHERE id = ?").run(id);
    return result.changes > 0;
  }

  unarchiveByRecipient(id: number): boolean {
    const result = db.prepare("UPDATE emails SET archived_by_recipient = 0 WHERE id = ?").run(id);
    return result.changes > 0;
  }

  moveToTrash(id: number): boolean {
    const result = db.prepare("UPDATE emails SET is_deleted = 1 WHERE id = ?").run(id);
    return result.changes > 0;
  }

  restore(id: number): boolean {
    const result = db.prepare("UPDATE emails SET is_deleted = 0 WHERE id = ?").run(id);
    return result.changes > 0;
  }

  permanentDelete(id: number): boolean {
    const result = db.prepare("DELETE FROM emails WHERE id = ?").run(id);
    return result.changes > 0;
  }

  countUnread(userId: number): number {
    const result = db.prepare(`
      SELECT COUNT(*) as count FROM emails 
      WHERE to_user_id = ? AND is_read = 0 AND is_deleted = 0 
        AND (archived_by_recipient = 0 OR archived_by_recipient IS NULL)
    `).get(userId) as { count: number };
    return result.count;
  }
}

export const emailRepository = new EmailRepository();