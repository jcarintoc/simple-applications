import { postRepository, likeRepository } from "../repositories/index.js";
import type {
  PostWithAuthor,
  CreatePostDto,
  UpdatePostDto,
} from "../types/index.js";

export class PostService {
  getFeed(userId: number): PostWithAuthor[] {
    return postRepository.findByFollowingUsers(userId);
  }

  getByUser(userId: number): PostWithAuthor[] {
    return postRepository.findByUser(userId);
  }

  getById(id: number): PostWithAuthor | null {
    return postRepository.findById(id) || null;
  }

  create(userId: number, data: CreatePostDto): PostWithAuthor {
    // Validate image_url
    if (!data.image_url || data.image_url.trim().length === 0) {
      throw new Error("Image URL is required");
    }

    // Validate caption length if provided
    if (data.caption && data.caption.length > 2000) {
      throw new Error("Caption must be at most 2000 characters");
    }

    const post = postRepository.create(userId, {
      image_url: data.image_url.trim(),
      caption: data.caption?.trim() || null,
    });

    const postWithAuthor = postRepository.findById(post.id);
    if (!postWithAuthor) {
      throw new Error("Failed to create post");
    }
    return postWithAuthor;
  }

  update(id: number, userId: number, data: UpdatePostDto): PostWithAuthor {
    const post = postRepository.findById(id);
    if (!post) {
      throw new Error("Post not found");
    }

    if (post.user_id !== userId) {
      throw new Error("You don't have permission to update this post");
    }

    // Validate caption length if provided
    if (data.caption !== undefined) {
      if (data.caption && data.caption.length > 2000) {
        throw new Error("Caption must be at most 2000 characters");
      }
      data.caption = data.caption?.trim() || null;
    }

    postRepository.update(id, data);
    const updated = postRepository.findById(id);
    if (!updated) {
      throw new Error("Failed to update post");
    }
    return updated;
  }

  delete(id: number, userId: number): void {
    const post = postRepository.findById(id);
    if (!post) {
      throw new Error("Post not found");
    }

    if (post.user_id !== userId) {
      throw new Error("You don't have permission to delete this post");
    }

    postRepository.delete(id);
  }

  toggleLike(postId: number, userId: number): { hasLiked: boolean; likes_count: number } {
    const post = postRepository.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const existingLike = likeRepository.findByUserAndPost(userId, postId);

    if (existingLike) {
      // Remove like
      likeRepository.deleteByUserAndPost(userId, postId);
      postRepository.decrementLikes(postId);
      const updated = postRepository.findById(postId);
      return {
        hasLiked: false,
        likes_count: updated?.likes_count || post.likes_count - 1,
      };
    } else {
      // Add like
      likeRepository.create(userId, postId);
      postRepository.incrementLikes(postId);
      const updated = postRepository.findById(postId);
      return {
        hasLiked: true,
        likes_count: updated?.likes_count || post.likes_count + 1,
      };
    }
  }
}

export const postService = new PostService();
