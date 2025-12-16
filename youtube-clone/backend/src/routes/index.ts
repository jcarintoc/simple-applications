import { Router } from "express";
import authRoutes from "./auth.routes.js";
import csrfRoutes from "./csrf.routes.js";
import videoRoutes from "./video.routes.js";
import likeRoutes from "./like.routes.js";
import commentRoutes from "./comment.routes.js";
import playlistRoutes from "./playlist.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/csrf-token", csrfRoutes);
router.use("/videos", videoRoutes);
router.use("/videos", likeRoutes);
router.use("/", commentRoutes);
router.use("/playlists", playlistRoutes);

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;
