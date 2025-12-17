import type { Response } from "express";
import { playlistService } from "../services/index.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export class PlaylistController {
  getAll(req: AuthRequest, res: Response): void {
    const playlists = playlistService.getUserPlaylists(req.userId!);
    res.json({ playlists });
  }

  getById(req: AuthRequest, res: Response): void {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid playlist ID" });
      return;
    }

    const playlist = playlistService.getPlaylistById(id, req.userId!);
    if (!playlist) {
      res.status(404).json({ error: "Playlist not found" });
      return;
    }

    // Check ownership
    if (playlist.user_id !== req.userId) {
      res.status(403).json({ error: "Not authorized" });
      return;
    }

    res.json({ playlist });
  }

  create(req: AuthRequest, res: Response): void {
    const { name, description } = req.body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      res.status(400).json({ error: "Playlist name is required" });
      return;
    }

    const playlist = playlistService.createPlaylist(req.userId!, {
      name: name.trim(),
      description: description?.trim(),
    });

    res.status(201).json({ message: "Playlist created", playlist });
  }

  update(req: AuthRequest, res: Response): void {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid playlist ID" });
      return;
    }

    const { name, description } = req.body;
    const playlist = playlistService.updatePlaylist(id, req.userId!, {
      name: name?.trim(),
      description: description?.trim(),
    });

    if (!playlist) {
      res.status(404).json({ error: "Playlist not found or not authorized" });
      return;
    }

    res.json({ message: "Playlist updated", playlist });
  }

  delete(req: AuthRequest, res: Response): void {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid playlist ID" });
      return;
    }

    const success = playlistService.deletePlaylist(id, req.userId!);
    if (!success) {
      res.status(404).json({ error: "Playlist not found or not authorized" });
      return;
    }

    res.json({ message: "Playlist deleted" });
  }

  addSong(req: AuthRequest, res: Response): void {
    const playlistId = parseInt(req.params.id);
    const songId = parseInt(req.params.songId);

    if (isNaN(playlistId) || isNaN(songId)) {
      res.status(400).json({ error: "Invalid playlist or song ID" });
      return;
    }

    const result = playlistService.addSongToPlaylist(playlistId, songId, req.userId!);
    if (!result.success) {
      const status = result.error === "Not authorized" ? 403 : 400;
      res.status(status).json({ error: result.error });
      return;
    }

    res.json({ message: "Song added to playlist" });
  }

  removeSong(req: AuthRequest, res: Response): void {
    const playlistId = parseInt(req.params.id);
    const songId = parseInt(req.params.songId);

    if (isNaN(playlistId) || isNaN(songId)) {
      res.status(400).json({ error: "Invalid playlist or song ID" });
      return;
    }

    const result = playlistService.removeSongFromPlaylist(playlistId, songId, req.userId!);
    if (!result.success) {
      const status = result.error === "Not authorized" ? 403 : 400;
      res.status(status).json({ error: result.error });
      return;
    }

    res.json({ message: "Song removed from playlist" });
  }
}

export const playlistController = new PlaylistController();
