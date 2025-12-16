import type { Request, Response } from "express";
import { postService } from "../services/index.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import type { CreatePostDto, UpdatePostDto } from "../types/index.js";

export class PostController {
  getFeed(req: AuthRequest, res: Response): void {
    try {
      const posts = postService.getFeed(req.userId!);
      res.json({ posts });
    } catch (error) {
      console.error("Error fetching feed:", error);
      res.status(500).json({ error: "Failed to fetch feed" });
    }
  }

  getAll(req: Request, res: Response): void {
    const userId = req.query.user_id ? parseInt(req.query.user_id as string, 10) : undefined;

    try {
      let posts;
      if (userId && !isNaN(userId)) {
        posts = postService.getByUser(userId);
      } else {
        // Return empty array if no filter specified
        posts = [];
      }
      res.json({ posts });
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  }

  getById(req: Request, res: Response): void {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid post ID" });
      return;
    }

    try {
      const post = postService.getById(id);
      if (!post) {
        res.status(404).json({ error: "Post not found" });
        return;
      }
      res.json({ post });
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ error: "Failed to fetch post" });
    }
  }

  getByUser(req: Request, res: Response): void {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    try {
      const posts = postService.getByUser(userId);
      res.json({ posts });
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  }

  create(req: AuthRequest, res: Response): void {
    const data = req.body as CreatePostDto;

    try {
      const post = postService.create(req.userId!, data);
      res.status(201).json({ post });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  update(req: AuthRequest, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const data = req.body as UpdatePostDto;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid post ID" });
      return;
    }

    try {
      const post = postService.update(id, req.userId!, data);
      res.json({ post });
    } catch (error) {
      if (error instanceof Error) {
        const statusCode = error.message.includes("not found") ? 404 : error.message.includes("permission") ? 403 : 400;
        res.status(statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  delete(req: AuthRequest, res: Response): void {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid post ID" });
      return;
    }

    try {
      postService.delete(id, req.userId!);
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      if (error instanceof Error) {
        const statusCode = error.message.includes("not found") ? 404 : error.message.includes("permission") ? 403 : 400;
        res.status(statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  like(req: AuthRequest, res: Response): void {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid post ID" });
      return;
    }

    try {
      const result = postService.toggleLike(id, req.userId!);
      res.json(result);
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
