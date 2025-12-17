import { Router } from "express";
import { continueWatchingController } from "../controllers/index.js";
import type { SessionRequest } from "../middleware/session.middleware.js";

const router = Router();

// Continue watching uses session-based tracking (no auth required)
router.get("/", (req, res) => continueWatchingController.getContinueWatching(req as SessionRequest, res));
router.post("/:titleId", (req, res) => continueWatchingController.updateProgress(req as SessionRequest, res));
router.delete("/:titleId", (req, res) => continueWatchingController.removeFromContinueWatching(req as SessionRequest, res));
router.delete("/", (req, res) => continueWatchingController.clearContinueWatching(req as SessionRequest, res));

export default router;
