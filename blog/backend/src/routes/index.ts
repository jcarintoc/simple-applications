import { Router } from "express";
import authRoutes from "./auth.routes.js";
import postRoutes from "./post.routes.js";
import commentRoutes from "./comment.routes.js";
import csrfRoutes from "./csrf.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);
router.use("/csrf", csrfRoutes);

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;
