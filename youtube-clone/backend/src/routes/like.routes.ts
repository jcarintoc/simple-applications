import { Router } from "express";
import { likeController } from "../controllers/like.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";

const router = Router();

router.post("/:videoId/like", authenticate, verifyCsrfToken, likeController.likeVideo);
router.delete("/:videoId/like", authenticate, verifyCsrfToken, likeController.unlikeVideo);

export default router;
