import { Router } from "express";
import authRoutes from "./auth.routes.js";
import bookmarkRoutes from "./bookmark.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/bookmarks", bookmarkRoutes);

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;
