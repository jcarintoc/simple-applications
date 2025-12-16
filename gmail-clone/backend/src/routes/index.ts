import { Router } from "express";
import authRoutes from "./auth.routes.js";
import emailRoutes from "./email.routes.js";
import userRoutes from "./user.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/emails", emailRoutes);
router.use("/users", userRoutes);

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;
