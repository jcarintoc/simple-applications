import { commentRepository, postRepository } from "../repositories/index.js";
import type {
  CommentWithAuthor,
  CreateCommentDto,
  UpdateCommentDto,
} from "../types/index.js";

export class CommentService {
  getByPost(postId: number): CommentWithAuthor[] {
    return commentRepository.findByPost(postId);
  }

  create(userId: number, postId: number, data: CreateCommentDto): CommentWithAuthor {
    // Validate post exists
    const post = postRepository.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Validate content
    if (!data.content || data.content.trim().length === 0) {
      throw new Error("Comment content is required");
    }
    if (data.content.length > 1000) {
      throw new Error("Comment content must be at most 1000 characters");
    }

    const comment = commentRepository.create(userId, postId, {
      content: data.content.trim(),
    });

    const commentWithAuthor = commentRepository.findById(comment.id);
    if (!commentWithAuthor) {
      throw new Error("Failed to create comment");
    }
    return commentWithAuthor;
  }

  update(id: number, userId: number, data: UpdateCommentDto): CommentWithAuthor {
    const comment = commentRepository.findById(id);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.user_id !== userId) {
      throw new Error("You don't have permission to update this comment");
    }

    // Validate content
    if (data.content !== undefined) {
      if (data.content.trim().length === 0) {
        throw new Error("Comment content cannot be empty");
      }
      if (data.content.length > 1000) {
        throw new Error("Comment content must be at most 1000 characters");
      }
      data.content = data.content.trim();
    }

    commentRepository.update(id, data);
    const updated = commentRepository.findById(id);
    if (!updated) {
      throw new Error("Failed to update comment");
    }
    return updated;
  }

  delete(id: number, userId: number): void {
    const comment = commentRepository.findById(id);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.user_id !== userId) {
      throw new Error("You don't have permission to delete this comment");
    }

    commentRepository.delete(id);
  }
}

export const commentService = new CommentService();
