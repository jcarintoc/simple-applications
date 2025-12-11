import { commentRepository } from "../repositories/comment.repository.js";
import { postRepository } from "../repositories/post.repository.js";
import type { CommentWithUser } from "../repositories/comment.repository.js";

export class CommentService {
  create(userId: number, postId: number, content: string): number {
    // Check if post exists
    const post = postRepository.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    if (!content || content.trim().length === 0) {
      throw new Error("Comment content is required");
    }

    if (content.length > 500) {
      throw new Error("Comment content must be at most 500 characters");
    }

    return commentRepository.create(userId, postId, content.trim());
  }

  getByPostId(postId: number, limit: number = 50, offset: number = 0): CommentWithUser[] {
    return commentRepository.findByPostId(postId, limit, offset);
  }

  delete(commentId: number, userId: number): boolean {
    const deleted = commentRepository.delete(commentId, userId);
    if (!deleted) {
      throw new Error("Comment not found or you don't have permission to delete it");
    }
    return true;
  }
}

export const commentService = new CommentService();
