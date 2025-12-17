import { Router } from "express";
import authRoutes from "./auth.routes.js";
import hotelRoutes from "./hotel.routes.js";
import bookingRoutes from "./booking.routes.js";
import reviewRoutes from "./review.routes.js";
import savedRoutes from "./saved.routes.js";
import csrfRoutes from "./csrf.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/hotels", hotelRoutes);
router.use("/bookings", bookingRoutes);
router.use("/reviews", reviewRoutes);
router.use("/saved", savedRoutes);
router.use("/csrf", csrfRoutes);

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;
