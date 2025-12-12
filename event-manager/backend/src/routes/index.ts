import { Router } from "express";
import authRoutes from "./auth.routes.js";
import eventRoutes from "./event.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/events", eventRoutes);

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;
