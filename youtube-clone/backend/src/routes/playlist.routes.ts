import { Router } from "express";
import { playlistController } from "../controllers/playlist.controller.js";
import { authenticate, optionalAuth } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";

const router = Router();

// Playlist CRUD
router.get("/", authenticate, playlistController.getPlaylists);
router.get("/:id", optionalAuth, playlistController.getPlaylistById);
router.post("/", authenticate, verifyCsrfToken, playlistController.createPlaylist);
router.put("/:id", authenticate, verifyCsrfToken, playlistController.updatePlaylist);
router.delete("/:id", authenticate, verifyCsrfToken, playlistController.deletePlaylist);

// Playlist videos
router.post("/:id/videos", authenticate, verifyCsrfToken, playlistController.addVideoToPlaylist);
router.delete("/:playlistId/videos/:videoId", authenticate, verifyCsrfToken, playlistController.removeVideoFromPlaylist);

export default router;
