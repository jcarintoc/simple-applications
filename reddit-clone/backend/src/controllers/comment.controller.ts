import type { Request, Response } from "express";
import { commentService } from "../services/index.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import type { CreateCommentDto, UpdateCommentDto } from "../types/index.js";

export class CommentController {
  getByPost(req: Request, res: Response): void {
    const postId = parseInt(req.params.postId || req.params.id, 10);

    if (isNaN(postId)) {
      res.status(400).json({ error: "Invalid post ID" });
      return;
    }

    try {
      const comments = commentService.getByPost(postId);
      res.json({ comments });
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  }

  getById(req: Request, res: Response): void {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid comment ID" });
      return;
    }

    try {
      const comment = commentService.getById(id);
      if (!comment) {
        res.status(404).json({ error: "Comment not found" });
        return;
      }
      res.json({ comment });
    } catch (error) {
      console.error("Error fetching comment:", error);
      res.status(500).json({ error: "Failed to fetch comment" });
    }
  }

  create(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const postId = parseInt(req.params.postId || req.params.id, 10);
    const data: CreateCommentDto = req.body;

    if (isNaN(postId)) {
      res.status(400).json({ error: "Invalid post ID" });
      return;
    }

    if (!data.content) {
      res.status(400).json({ error: "Content is required" });
      return;
    }

    try {
      const comment = commentService.create(userId, postId, data);
      res.status(201).json({ comment });
    } catch (error) {
      console.error("Error creating comment:", error);
      const message = error instanceof Error ? error.message : "Failed to create comment";
      res.status(400).json({ error: message });
    }
  }

  update(req: AuthRequest, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const userId = req.userId!;
    const data: UpdateCommentDto = req.body;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid comment ID" });
      return;
    }

    try {
      const comment = commentService.update(id, userId, data);
      res.json({ comment });
    } catch (error) {
      console.error("Error updating comment:", error);
      const message = error instanceof Error ? error.message : "Failed to update comment";
      const status = message.includes("not found") || message.includes("permission") ? 404 : 400;
      res.status(status).json({ error: message });
    }
  }

  delete(req: AuthRequest, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const userId = req.userId!;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid comment ID" });
      return;
    }

    try {
      const success = commentService.delete(id, userId);
      if (!success) {
        res.status(404).json({ error: "Comment not found" });
        return;
      }
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      const message = error instanceof Error ? error.message : "Failed to delete comment";
      const status = message.includes("not found") || message.includes("permission") ? 404 : 400;
      res.status(status).json({ error: message });
    }
  }

  upvote(req: AuthRequest, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const userId = req.userId!;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid comment ID" });
      return;
    }

    try {
      const result = commentService.toggleUpvote(id, userId);
      res.json(result);
    } catch (error) {
      console.error("Error upvoting comment:", error);
      const message = error instanceof Error ? error.message : "Failed to upvote comment";
      res.status(400).json({ error: message });
    }
  }
}

export const commentController = new CommentController();

