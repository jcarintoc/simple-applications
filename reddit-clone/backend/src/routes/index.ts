import { Router } from "express";
import authRoutes from "./auth.routes.js";
import subredditRoutes from "./subreddit.routes.js";
import postRoutes from "./post.routes.js";
import commentsRoutes from "./comments.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/subreddits", subredditRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentsRoutes);

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;
