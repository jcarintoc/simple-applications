import { likeRepository } from "../repositories/like.repository.js";
import { postRepository } from "../repositories/post.repository.js";

export class LikeService {
  like(userId: number, postId: number): { success: boolean; message: string } {
    // Check if post exists
    const post = postRepository.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const created = likeRepository.create(userId, postId);

    if (!created) {
      // Already liked
      return { success: true, message: "Post already liked" };
    }

    return { success: true, message: "Post liked successfully" };
  }

  unlike(userId: number, postId: number): { success: boolean; message: string } {
    const deleted = likeRepository.delete(userId, postId);

    if (!deleted) {
      // Not liked yet
      return { success: true, message: "Post was not liked" };
    }

    return { success: true, message: "Post unliked successfully" };
  }

  getPostLikes(postId: number, limit: number = 50, offset: number = 0) {
    return likeRepository.findByPostId(postId, limit, offset);
  }
}

export const likeService = new LikeService();
