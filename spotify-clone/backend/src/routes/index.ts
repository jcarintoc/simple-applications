import { Router } from "express";
import authRoutes from "./auth.routes.js";
import songRoutes from "./song.routes.js";
import playlistRoutes from "./playlist.routes.js";
import likeRoutes from "./like.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/songs", songRoutes);
router.use("/playlists", playlistRoutes);
router.use("/likes", likeRoutes);

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;
