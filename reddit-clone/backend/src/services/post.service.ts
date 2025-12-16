import { postRepository, subredditRepository, voteRepository } from "../repositories/index.js";
import type {
  PostWithAuthor,
  CreatePostDto,
  UpdatePostDto,
} from "../types/index.js";

export class PostService {
  getAll(): PostWithAuthor[] {
    return postRepository.findAll();
  }

  getBySubreddit(subredditId: number): PostWithAuthor[] {
    return postRepository.findBySubreddit(subredditId);
  }

  getById(id: number): PostWithAuthor | null {
    return postRepository.findById(id) || null;
  }

  create(userId: number, data: CreatePostDto): PostWithAuthor {
    // Validate subreddit exists
    const subreddit = subredditRepository.findById(data.subreddit_id);
    if (!subreddit) {
      throw new Error("Subreddit not found");
    }

    // Validate title and content
    if (!data.title || data.title.trim().length === 0) {
      throw new Error("Post title is required");
    }
    if (data.title.length > 300) {
      throw new Error("Post title must be at most 300 characters");
    }
    if (!data.content || data.content.trim().length === 0) {
      throw new Error("Post content is required");
    }
    if (data.content.length > 10000) {
      throw new Error("Post content must be at most 10000 characters");
    }

    const id = postRepository.create(userId, {
      ...data,
      title: data.title.trim(),
      content: data.content.trim(),
    });

    const post = postRepository.findById(id);
    if (!post) {
      throw new Error("Failed to create post");
    }
    return post;
  }

  update(id: number, userId: number, data: UpdatePostDto): PostWithAuthor {
    const post = postRepository.findById(id);
    if (!post) {
      throw new Error("Post not found");
    }

    if (post.user_id !== userId) {
      throw new Error("You don't have permission to update this post");
    }

    // Validate updates
    if (data.title !== undefined) {
      if (data.title.trim().length === 0) {
        throw new Error("Post title cannot be empty");
      }
      if (data.title.length > 300) {
        throw new Error("Post title must be at most 300 characters");
      }
      data.title = data.title.trim();
    }

    if (data.content !== undefined) {
      if (data.content.trim().length === 0) {
        throw new Error("Post content cannot be empty");
      }
      if (data.content.length > 10000) {
        throw new Error("Post content must be at most 10000 characters");
      }
      data.content = data.content.trim();
    }

    const success = postRepository.update(id, data);
    if (!success) {
      throw new Error("Failed to update post");
    }

    const updated = postRepository.findById(id);
    if (!updated) {
      throw new Error("Failed to retrieve updated post");
    }
    return updated;
  }

  delete(id: number, userId: number): boolean {
    const post = postRepository.findById(id);
    if (!post) {
      throw new Error("Post not found");
    }

    if (post.user_id !== userId) {
      throw new Error("You don't have permission to delete this post");
    }

    return postRepository.delete(id);
  }

  toggleUpvote(id: number, userId: number): { hasVoted: boolean; upvotes: number } {
    const post = postRepository.findById(id);
    if (!post) {
      throw new Error("Post not found");
    }

    const existingVote = voteRepository.findByUserAndPost(userId, id);

    if (existingVote) {
      // Remove vote
      voteRepository.deleteByUserAndPost(userId, id);
      postRepository.decrementUpvotes(id);
      const updated = postRepository.findById(id);
      return {
        hasVoted: false,
        upvotes: updated?.upvotes || post.upvotes - 1,
      };
    } else {
      // Add vote
      voteRepository.create(userId, id, null);
      postRepository.incrementUpvotes(id);
      const updated = postRepository.findById(id);
      return {
        hasVoted: true,
        upvotes: updated?.upvotes || post.upvotes + 1,
      };
    }
  }
}

export const postService = new PostService();

