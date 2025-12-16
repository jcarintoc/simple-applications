import { Router } from "express";
import authRoutes from "./auth.routes.js";
import propertyRoutes from "./property.routes.js";
import bookingRoutes from "./booking.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/properties", propertyRoutes);
router.use("/bookings", bookingRoutes);

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;
