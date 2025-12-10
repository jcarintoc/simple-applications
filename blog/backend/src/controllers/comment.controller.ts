import { Request, Response } from "express";
import * as commentService from "../services/comment.service.js";
import { CreateCommentDto } from "../types/index.js";

interface AuthRequest extends Request {
  user?: { id: number };
}

export const createComment = (req: Request, res: Response): void => {
  try {
    const user = (req as AuthRequest).user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const postId = parseInt(req.params.postId, 10);

    if (isNaN(postId)) {
      res.status(400).json({ error: "Invalid post ID" });
      return;
    }

    const data: CreateCommentDto = req.body;

    if (!data.content) {
      res.status(400).json({ error: "Content is required" });
      return;
    }

    const comment = commentService.createComment(postId, data, user.id);

    if (!comment) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create comment" });
  }
};

export const getCommentsByPostId = (req: Request, res: Response): void => {
  try {
    const postId = parseInt(req.params.postId, 10);

    if (isNaN(postId)) {
      res.status(400).json({ error: "Invalid post ID" });
      return;
    }

    const comments = commentService.getCommentsByPostId(postId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

export const deleteComment = (req: Request, res: Response): void => {
  try {
    const user = (req as AuthRequest).user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid comment ID" });
      return;
    }

    const deleted = commentService.deleteComment(id, user.id);

    if (!deleted) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized to delete this comment") {
      res.status(403).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Failed to delete comment" });
  }
};
