import type { Response } from "express";
import { postService } from "../services/post.service.js";
import { createPostSchema } from "../types/index.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export class PostController {
  create(req: AuthRequest, res: Response): void {
    try {
      const validation = createPostSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ error: validation.error.issues[0].message });
        return;
      }

      const { content } = validation.data;
      const postId = postService.create(req.userId!, content);
      const post = postService.getById(postId, req.userId);

      res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  getFeed(req: AuthRequest, res: Response): void {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const posts = postService.getFeed(req.userId, limit, offset);

      res.json({ posts });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  getById(req: AuthRequest, res: Response): void {
    try {
      const postId = parseInt(req.params.id);
      const post = postService.getById(postId, req.userId);

      if (!post) {
        res.status(404).json({ error: "Post not found" });
        return;
      }

      res.json({ post });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  getUserPosts(req: AuthRequest, res: Response): void {
    try {
      const userId = parseInt(req.params.userId);
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const posts = postService.getUserPosts(userId, req.userId, limit, offset);

      res.json({ posts });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  delete(req: AuthRequest, res: Response): void {
    try {
      const postId = parseInt(req.params.id);
      postService.delete(postId, req.userId!);

      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}

export const postController = new PostController();
