import { Router } from "express";
import authRoutes from "./auth.routes.js";
import passwordRoutes from "./password.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/passwords", passwordRoutes);

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;
