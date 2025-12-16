import { commentRepository, postRepository, voteRepository } from "../repositories/index.js";
import type {
  CommentWithAuthor,
  CreateCommentDto,
  UpdateCommentDto,
} from "../types/index.js";

export class CommentService {
  getByPost(postId: number): CommentWithAuthor[] {
    return commentRepository.findByPost(postId);
  }

  getById(id: number): CommentWithAuthor | null {
    return commentRepository.findById(id) || null;
  }

  create(userId: number, postId: number, data: CreateCommentDto): CommentWithAuthor {
    // Validate post exists
    const post = postRepository.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Validate parent_id if provided
    if (data.parent_id) {
      const parent = commentRepository.findById(data.parent_id);
      if (!parent) {
        throw new Error("Parent comment not found");
      }
      if (parent.post_id !== postId) {
        throw new Error("Parent comment does not belong to this post");
      }
    }

    // Validate content
    if (!data.content || data.content.trim().length === 0) {
      throw new Error("Comment content is required");
    }
    if (data.content.length > 10000) {
      throw new Error("Comment content must be at most 10000 characters");
    }

    const id = commentRepository.create(userId, postId, {
      ...data,
      content: data.content.trim(),
    });

    const comment = commentRepository.findById(id);
    if (!comment) {
      throw new Error("Failed to create comment");
    }
    return comment;
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
      if (data.content.length > 10000) {
        throw new Error("Comment content must be at most 10000 characters");
      }
      data.content = data.content.trim();
    }

    const success = commentRepository.update(id, data);
    if (!success) {
      throw new Error("Failed to update comment");
    }

    const updated = commentRepository.findById(id);
    if (!updated) {
      throw new Error("Failed to retrieve updated comment");
    }
    return updated;
  }

  delete(id: number, userId: number): boolean {
    const comment = commentRepository.findById(id);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.user_id !== userId) {
      throw new Error("You don't have permission to delete this comment");
    }

    return commentRepository.delete(id);
  }

  toggleUpvote(id: number, userId: number): { hasVoted: boolean; upvotes: number } {
    const comment = commentRepository.findById(id);
    if (!comment) {
      throw new Error("Comment not found");
    }

    const existingVote = voteRepository.findByUserAndComment(userId, id);

    if (existingVote) {
      // Remove vote
      voteRepository.deleteByUserAndComment(userId, id);
      commentRepository.decrementUpvotes(id);
      const updated = commentRepository.findById(id);
      return {
        hasVoted: false,
        upvotes: updated?.upvotes || comment.upvotes - 1,
      };
    } else {
      // Add vote
      voteRepository.create(userId, null, id);
      commentRepository.incrementUpvotes(id);
      const updated = commentRepository.findById(id);
      return {
        hasVoted: true,
        upvotes: updated?.upvotes || comment.upvotes + 1,
      };
    }
  }
}

export const commentService = new CommentService();

