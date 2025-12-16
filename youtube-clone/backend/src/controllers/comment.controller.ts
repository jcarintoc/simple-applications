import type { Request, Response } from "express";
import { commentService } from "../services/comment.service.js";
import { createCommentSchema, updateCommentSchema } from "../types/index.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export const commentController = {
  getComments(req: Request, res: Response): void {
    try {
      const videoId = parseInt(req.params.videoId);

      if (isNaN(videoId)) {
        res.status(400).json({ error: "Invalid video ID" });
        return;
      }

      const comments = commentService.getCommentsByVideo(videoId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  },

  createComment(req: AuthRequest, res: Response): void {
    try {
      const videoId = parseInt(req.params.videoId);

      if (isNaN(videoId)) {
        res.status(400).json({ error: "Invalid video ID" });
        return;
      }

      const parseResult = createCommentSchema.safeParse(req.body);

      if (!parseResult.success) {
        res.status(400).json({ error: parseResult.error.errors[0].message });
        return;
      }

      const comment = commentService.createComment(
        req.userId!,
        videoId,
        parseResult.data.content
      );

      res.status(201).json(comment);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create comment";
      const status = message === "Video not found" ? 404 : 500;
      res.status(status).json({ error: message });
    }
  },

  updateComment(req: AuthRequest, res: Response): void {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid comment ID" });
        return;
      }

      const parseResult = updateCommentSchema.safeParse(req.body);

      if (!parseResult.success) {
        res.status(400).json({ error: parseResult.error.errors[0].message });
        return;
      }

      const comment = commentService.updateComment(
        id,
        req.userId!,
        parseResult.data.content
      );

      res.json(comment);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update comment";
      const status = message.includes("Not authorized") ? 403 : message.includes("not found") ? 404 : 500;
      res.status(status).json({ error: message });
    }
  },

  deleteComment(req: AuthRequest, res: Response): void {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid comment ID" });
        return;
      }

      commentService.deleteComment(id, req.userId!);
      res.status(204).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete comment";
      const status = message.includes("Not authorized") ? 403 : message.includes("not found") ? 404 : 500;
      res.status(status).json({ error: message });
    }
  },
};
