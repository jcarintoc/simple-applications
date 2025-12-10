import * as commentRepository from "../repositories/comment.repository.js";
import * as postRepository from "../repositories/post.repository.js";
import { CreateCommentDto, Comment, CommentWithAuthor } from "../types/index.js";

export const createComment = (postId: number, data: CreateCommentDto, authorId: number): Comment | null => {
  const post = postRepository.findPostById(postId);

  if (!post) {
    return null;
  }

  return commentRepository.createComment(postId, data, authorId);
};

export const getCommentsByPostId = (postId: number): CommentWithAuthor[] => {
  return commentRepository.findCommentsByPostId(postId);
};

export const deleteComment = (id: number, userId: number): boolean => {
  const comment = commentRepository.findCommentById(id);

  if (!comment) {
    return false;
  }

  if (comment.author_id !== userId) {
    throw new Error("Unauthorized to delete this comment");
  }

  return commentRepository.deleteComment(id);
};
