import { Router } from "express";
import * as commentController from "../controllers/comment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { csrfProtection } from "../middleware/csrf.middleware.js";

const router = Router();

router.get("/post/:postId", commentController.getCommentsByPostId);
router.post("/post/:postId", authMiddleware, csrfProtection, commentController.createComment);
router.delete("/:id", authMiddleware, csrfProtection, commentController.deleteComment);

export default router;
