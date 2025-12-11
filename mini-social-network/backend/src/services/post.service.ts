import { postRepository } from "../repositories/post.repository.js";
import type { PostWithStats } from "../repositories/post.repository.js";

export class PostService {
  create(userId: number, content: string): number {
    if (!content || content.trim().length === 0) {
      throw new Error("Post content is required");
    }

    if (content.length > 1000) {
      throw new Error("Post content must be at most 1000 characters");
    }

    return postRepository.create(userId, content.trim());
  }

  getFeed(currentUserId?: number, limit: number = 50, offset: number = 0): PostWithStats[] {
    return postRepository.getAllWithStats(limit, offset, currentUserId);
  }

  getById(postId: number, currentUserId?: number): PostWithStats | undefined {
    return postRepository.getPostWithStats(postId, currentUserId);
  }

  getUserPosts(userId: number, currentUserId?: number, limit: number = 50, offset: number = 0): PostWithStats[] {
    const posts = postRepository.findByUserId(userId, limit, offset);
    return posts.map((post) => {
      const stats = postRepository.getPostWithStats(post.id, currentUserId);
      return stats!;
    });
  }

  delete(postId: number, userId: number): boolean {
    const deleted = postRepository.delete(postId, userId);
    if (!deleted) {
      throw new Error("Post not found or you don't have permission to delete it");
    }
    return true;
  }
}

export const postService = new PostService();
