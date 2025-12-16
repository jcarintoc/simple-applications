import { commentRepository } from "../repositories/comment.repository.js";
import { videoRepository } from "../repositories/video.repository.js";
import type { CommentWithUser } from "../types/index.js";
import db from "../db/database.js";

export const commentService = {
  getCommentsByVideo(videoId: number): CommentWithUser[] {
    return commentRepository.findByVideoId(videoId);
  },

  createComment(userId: number, videoId: number, content: string): CommentWithUser {
    const video = videoRepository.findById(videoId);
    if (!video) {
      throw new Error("Video not found");
    }

    const id = commentRepository.create(userId, videoId, content);

    const query = `
      SELECT
        c.*,
        u.name as user_name,
        u.email as user_email
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `;
    const comment = db.prepare(query).get(id) as CommentWithUser;

    return comment;
  },

  updateComment(id: number, userId: number, content: string): CommentWithUser {
    const owner = commentRepository.getOwner(id);

    if (!owner) {
      throw new Error("Comment not found");
    }

    if (owner !== userId) {
      throw new Error("Not authorized to update this comment");
    }

    commentRepository.update(id, content);

    const query = `
      SELECT
        c.*,
        u.name as user_name,
        u.email as user_email
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `;
    const comment = db.prepare(query).get(id) as CommentWithUser;

    return comment;
  },

  deleteComment(id: number, userId: number): void {
    const owner = commentRepository.getOwner(id);

    if (!owner) {
      throw new Error("Comment not found");
    }

    if (owner !== userId) {
      throw new Error("Not authorized to delete this comment");
    }

    commentRepository.delete(id);
  },
};
