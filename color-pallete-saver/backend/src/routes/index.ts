import { Router } from "express";
import authRoutes from "./auth.routes.js";
import paletteRoutes from "./palette.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/palettes", paletteRoutes);

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;
