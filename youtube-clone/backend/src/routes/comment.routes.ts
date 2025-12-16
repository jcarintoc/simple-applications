import { Router } from "express";
import { commentController } from "../controllers/comment.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";

const router = Router();

// Video comments
router.get("/videos/:videoId/comments", commentController.getComments);
router.post("/videos/:videoId/comments", authenticate, verifyCsrfToken, commentController.createComment);

// Individual comments
router.put("/comments/:id", authenticate, verifyCsrfToken, commentController.updateComment);
router.delete("/comments/:id", authenticate, verifyCsrfToken, commentController.deleteComment);

export default router;
