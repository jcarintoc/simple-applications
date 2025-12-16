import type { Request, Response } from "express";
import { playlistService } from "../services/playlist.service.js";
import { createPlaylistSchema, updatePlaylistSchema, addVideoToPlaylistSchema } from "../types/index.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export const playlistController = {
  getPlaylists(req: AuthRequest, res: Response): void {
    try {
      const playlists = playlistService.getPlaylistsByUser(req.userId!);
      res.json(playlists);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch playlists" });
    }
  },

  getPlaylistById(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id);
      const userId = (req as AuthRequest).userId;

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid playlist ID" });
        return;
      }

      const playlist = playlistService.getPlaylistById(id, userId);
      res.json(playlist);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch playlist";
      const status = message.includes("not found") ? 404 : 500;
      res.status(status).json({ error: message });
    }
  },

  createPlaylist(req: AuthRequest, res: Response): void {
    try {
      const parseResult = createPlaylistSchema.safeParse(req.body);

      if (!parseResult.success) {
        res.status(400).json({ error: parseResult.error.errors[0].message });
        return;
      }

      const playlist = playlistService.createPlaylist(
        req.userId!,
        parseResult.data.name,
        parseResult.data.description,
        parseResult.data.is_public
      );

      res.status(201).json(playlist);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create playlist";
      res.status(500).json({ error: message });
    }
  },

  updatePlaylist(req: AuthRequest, res: Response): void {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid playlist ID" });
        return;
      }

      const parseResult = updatePlaylistSchema.safeParse(req.body);

      if (!parseResult.success) {
        res.status(400).json({ error: parseResult.error.errors[0].message });
        return;
      }

      const playlist = playlistService.updatePlaylist(
        id,
        req.userId!,
        parseResult.data.name,
        parseResult.data.description,
        parseResult.data.is_public
      );

      res.json(playlist);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update playlist";
      const status = message.includes("Not authorized") ? 403 : message.includes("not found") ? 404 : 500;
      res.status(status).json({ error: message });
    }
  },

  deletePlaylist(req: AuthRequest, res: Response): void {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid playlist ID" });
        return;
      }

      playlistService.deletePlaylist(id, req.userId!);
      res.status(204).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete playlist";
      const status = message.includes("Not authorized") ? 403 : message.includes("not found") ? 404 : 500;
      res.status(status).json({ error: message });
    }
  },

  addVideoToPlaylist(req: AuthRequest, res: Response): void {
    try {
      const playlistId = parseInt(req.params.id);

      if (isNaN(playlistId)) {
        res.status(400).json({ error: "Invalid playlist ID" });
        return;
      }

      const parseResult = addVideoToPlaylistSchema.safeParse(req.body);

      if (!parseResult.success) {
        res.status(400).json({ error: parseResult.error.errors[0].message });
        return;
      }

      playlistService.addVideoToPlaylist(playlistId, parseResult.data.video_id, req.userId!);
      res.status(201).json({ success: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add video";
      const status = message.includes("Not authorized") ? 403 :
                     message.includes("not found") ? 404 :
                     message.includes("already in") ? 400 : 500;
      res.status(status).json({ error: message });
    }
  },

  removeVideoFromPlaylist(req: AuthRequest, res: Response): void {
    try {
      const playlistId = parseInt(req.params.playlistId);
      const videoId = parseInt(req.params.videoId);

      if (isNaN(playlistId) || isNaN(videoId)) {
        res.status(400).json({ error: "Invalid ID" });
        return;
      }

      playlistService.removeVideoFromPlaylist(playlistId, videoId, req.userId!);
      res.status(200).json({ success: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to remove video";
      const status = message.includes("Not authorized") ? 403 :
                     message.includes("not found") || message.includes("not in") ? 404 : 500;
      res.status(status).json({ error: message });
    }
  },
};
