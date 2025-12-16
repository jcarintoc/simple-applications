import { Router } from "express";
import { videoController } from "../controllers/video.controller.js";
import { authenticate, optionalAuth } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";
import { uploadVideo } from "../middleware/upload.middleware.js";

const router = Router();

// Public routes
router.get("/", optionalAuth, videoController.getVideos);
router.get("/search", videoController.searchVideos);
router.get("/:id", optionalAuth, videoController.getVideoById);
router.post("/:id/view", videoController.incrementViews);

// Protected routes
router.post("/", authenticate, verifyCsrfToken, uploadVideo, videoController.uploadVideo);
router.put("/:id", authenticate, verifyCsrfToken, videoController.updateVideo);
router.delete("/:id", authenticate, verifyCsrfToken, videoController.deleteVideo);

// User videos
router.get("/user/:userId", videoController.getVideosByUser);

export default router;
