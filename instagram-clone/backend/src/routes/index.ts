import { Router } from "express";
import authRoutes from "./auth.routes.js";
import postRoutes from "./post.routes.js";
import commentsRoutes from "./comments.routes.js";
import userRoutes from "./user.routes.js";
import storyRoutes from "./story.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentsRoutes);
router.use("/users", userRoutes);
router.use("/stories", storyRoutes);

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;
