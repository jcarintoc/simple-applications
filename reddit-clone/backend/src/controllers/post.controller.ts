import type { Request, Response } from "express";
import { postService } from "../services/index.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import type { CreatePostDto, UpdatePostDto } from "../types/index.js";

export class PostController {
  getAll(req: Request, res: Response): void {
    const subredditId = req.query.subreddit_id
      ? parseInt(req.query.subreddit_id as string, 10)
      : undefined;

    try {
      let posts;
      if (subredditId && !isNaN(subredditId)) {
        posts = postService.getBySubreddit(subredditId);
      } else {
        posts = postService.getAll();
      }
      res.json({ posts });
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  }

  getBySubreddit(req: Request, res: Response): void {
    const subredditId = parseInt(req.params.subredditId, 10);

    if (isNaN(subredditId)) {
      res.status(400).json({ error: "Invalid subreddit ID" });
      return;
    }

    try {
      const posts = postService.getBySubreddit(subredditId);
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

  create(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const data: CreatePostDto = req.body;

    if (!data.subreddit_id || !data.title || !data.content) {
      res.status(400).json({ error: "Subreddit ID, title, and content are required" });
      return;
    }

    try {
      const post = postService.create(userId, data);
      res.status(201).json({ post });
    } catch (error) {
      console.error("Error creating post:", error);
      const message = error instanceof Error ? error.message : "Failed to create post";
      res.status(400).json({ error: message });
    }
  }

  update(req: AuthRequest, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const userId = req.userId!;
    const data: UpdatePostDto = req.body;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid post ID" });
      return;
    }

    try {
      const post = postService.update(id, userId, data);
      res.json({ post });
    } catch (error) {
      console.error("Error updating post:", error);
      const message = error instanceof Error ? error.message : "Failed to update post";
      const status = message.includes("not found") || message.includes("permission") ? 404 : 400;
      res.status(status).json({ error: message });
    }
  }

  delete(req: AuthRequest, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const userId = req.userId!;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid post ID" });
      return;
    }

    try {
      const success = postService.delete(id, userId);
      if (!success) {
        res.status(404).json({ error: "Post not found" });
        return;
      }
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      const message = error instanceof Error ? error.message : "Failed to delete post";
      const status = message.includes("not found") || message.includes("permission") ? 404 : 400;
      res.status(status).json({ error: message });
    }
  }

  upvote(req: AuthRequest, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const userId = req.userId!;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid post ID" });
      return;
    }

    try {
      const result = postService.toggleUpvote(id, userId);
      res.json(result);
    } catch (error) {
      console.error("Error upvoting post:", error);
      const message = error instanceof Error ? error.message : "Failed to upvote post";
      res.status(400).json({ error: message });
    }
  }
}

export const postController = new PostController();

