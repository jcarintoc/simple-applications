import { Router } from "express";
import authRoutes from "./auth.routes.js";
import titleRoutes from "./title.routes.js";
import watchlistRoutes from "./watchlist.routes.js";
import ratingRoutes from "./rating.routes.js";
import continueWatchingRoutes from "./continueWatching.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/titles", titleRoutes);
router.use("/watchlist", watchlistRoutes);
router.use("/ratings", ratingRoutes);
router.use("/continue-watching", continueWatchingRoutes);

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;
