import { Router } from "express";
import authRoutes from "./auth.routes.js";
import postRoutes from "./post.routes.js";
import likeRoutes from "./like.routes.js";
import commentRoutes from "./comment.routes.js";
import followRoutes from "./follow.routes.js";
import userRoutes from "./user.routes.js";
import { generateCsrfToken } from "../middleware/csrf.middleware.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/posts", likeRoutes);
router.use("/posts", commentRoutes);
router.use("/comments", commentRoutes);
router.use("/users", followRoutes);
router.use("/users", userRoutes);

// CSRF token endpoint
router.get("/csrf-token", (req, res) => {
  const token = generateCsrfToken(req, res);
  res.json({ csrfToken: token });
});

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;
