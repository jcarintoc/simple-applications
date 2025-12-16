import { emailRepository } from "../repositories/email.repository.js";
import { userRepository } from "../repositories/index.js";
import type { EmailWithUsers, SendEmailDto, EmailFolder } from "../types/index.js";

export class EmailService {
  getEmailsByFolder(userId: number, folder: EmailFolder): EmailWithUsers[] {
    switch (folder) {
      case "inbox":
        return emailRepository.findInbox(userId);
      case "sent":
        return emailRepository.findSent(userId);
      case "archive":
        return emailRepository.findArchived(userId);
      case "trash":
        return emailRepository.findTrash(userId);
      default:
        return [];
    }
  }

  getEmailById(id: number, userId: number): EmailWithUsers | null {
    const email = emailRepository.findByIdWithUsers(id);
    if (!email) return null;

    // Verify user has access (either sent or received)
    if (email.from_user_id !== userId && email.to_user_id !== userId) {
      return null;
    }

    return email;
  }

  sendEmail(fromUserId: number, data: SendEmailDto): EmailWithUsers {
    const toUser = userRepository.findByEmail(data.to_email);
    if (!toUser) {
      throw new Error("Recipient not found");
    }

    if (toUser.id === fromUserId) {
      throw new Error("Cannot send email to yourself");
    }

    const emailId = emailRepository.create(
      fromUserId,
      toUser.id,
      data.subject,
      data.body
    );

    const email = emailRepository.findByIdWithUsers(emailId);
    if (!email) {
      throw new Error("Failed to create email");
    }

    return email;
  }

  markAsRead(id: number, userId: number): boolean {
    const email = emailRepository.findById(id);
    if (!email || email.to_user_id !== userId) {
      return false;
    }

    return emailRepository.markAsRead(id);
  }

  markAsUnread(id: number, userId: number): boolean {
    const email = emailRepository.findById(id);
    if (!email || email.to_user_id !== userId) {
      return false;
    }

    return emailRepository.markAsUnread(id);
  }

  archive(id: number, userId: number): boolean {
    const email = emailRepository.findById(id);
    if (!email) {
      return false;
    }

    // If email is in trash, restore it first
    if (email.is_deleted === 1) {
      emailRepository.restore(id);
    }

    // Archive based on whether user is sender or recipient
    if (email.from_user_id === userId) {
      return emailRepository.archiveBySender(id);
    } else if (email.to_user_id === userId) {
      return emailRepository.archiveByRecipient(id);
    }

    return false;
  }

  unarchive(id: number, userId: number): boolean {
    const email = emailRepository.findById(id);
    if (!email) {
      return false;
    }

    // Unarchive based on whether user is sender or recipient
    if (email.from_user_id === userId) {
      return emailRepository.unarchiveBySender(id);
    } else if (email.to_user_id === userId) {
      return emailRepository.unarchiveByRecipient(id);
    }

    return false;
  }

  moveToTrash(id: number, userId: number): boolean {
    const email = emailRepository.findById(id);
    if (!email || (email.from_user_id !== userId && email.to_user_id !== userId)) {
      return false;
    }

    return emailRepository.moveToTrash(id);
  }

  restore(id: number, userId: number): boolean {
    const email = emailRepository.findById(id);
    if (!email || (email.from_user_id !== userId && email.to_user_id !== userId)) {
      return false;
    }

    return emailRepository.restore(id);
  }

  permanentDelete(id: number, userId: number): boolean {
    const email = emailRepository.findById(id);
    if (!email || (email.from_user_id !== userId && email.to_user_id !== userId)) {
      return false;
    }

    return emailRepository.permanentDelete(id);
  }

  getUnreadCount(userId: number): number {
    return emailRepository.countUnread(userId);
  }
}

export const emailService = new EmailService();