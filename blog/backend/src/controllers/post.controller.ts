import { Request, Response } from "express";
import * as postService from "../services/post.service.js";
import { CreatePostDto, UpdatePostDto } from "../types/index.js";

interface AuthRequest extends Request {
  user?: { id: number };
}

export const createPost = (req: Request, res: Response): void => {
  try {
    const user = (req as AuthRequest).user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const data: CreatePostDto = req.body;

    if (!data.title || !data.content) {
      res.status(400).json({ error: "Title and content are required" });
      return;
    }

    const post = postService.createPost(data, user.id);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

export const getAllPosts = (req: Request, res: Response): void => {
  try {
    const user = (req as AuthRequest).user;
    const publishedOnly = !user;

    const posts = postService.getAllPosts(publishedOnly);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

export const getPostById = (req: Request, res: Response): void => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid post ID" });
      return;
    }

    const post = postService.getPostById(id);

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

export const getPostBySlug = (req: Request, res: Response): void => {
  try {
    const { slug } = req.params;

    const post = postService.getPostBySlug(slug);

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

export const updatePost = (req: Request, res: Response): void => {
  try {
    const user = (req as AuthRequest).user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid post ID" });
      return;
    }

    const data: UpdatePostDto = req.body;

    const post = postService.updatePost(id, data, user.id);

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.json(post);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized to update this post") {
      res.status(403).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Failed to update post" });
  }
};

export const deletePost = (req: Request, res: Response): void => {
  try {
    const user = (req as AuthRequest).user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid post ID" });
      return;
    }

    const deleted = postService.deletePost(id, user.id);

    if (!deleted) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized to delete this post") {
      res.status(403).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Failed to delete post" });
  }
};

export const getMyPosts = (req: Request, res: Response): void => {
  try {
    const user = (req as AuthRequest).user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const posts = postService.getPostsByAuthor(user.id);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};
