import { Router } from "express";
import authRoutes from "./auth.routes.js";
import csrfRoutes from "./csrf.routes.js";
import profileRoutes from "./profile.routes.js";
import connectionRoutes from "./connection.routes.js";
import jobRoutes from "./job.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/", csrfRoutes);
router.use("/profiles", profileRoutes);
router.use("/connections", connectionRoutes);
router.use("/jobs", jobRoutes);

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;
