import type { Response } from "express";
import { commentService } from "../services/comment.service.js";
import { createCommentSchema } from "../types/index.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export class CommentController {
  create(req: AuthRequest, res: Response): void {
    try {
      const validation = createCommentSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ error: validation.error.issues[0].message });
        return;
      }

      const postId = parseInt(req.params.postId);
      const { content } = validation.data;
      const commentId = commentService.create(req.userId!, postId, content);

      res.status(201).json({ message: "Comment created successfully", commentId });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  getPostComments(req: AuthRequest, res: Response): void {
    try {
      const postId = parseInt(req.params.postId);
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const comments = commentService.getByPostId(postId, limit, offset);

      res.json({ comments });
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
      const commentId = parseInt(req.params.id);
      commentService.delete(commentId, req.userId!);

      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}

export const commentController = new CommentController();
