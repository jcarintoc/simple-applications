import { Router } from "express";
import { bookingController } from "../controllers/booking.controller.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";

const router = Router();

// All booking routes require authentication
router.use(authMiddleware);

router.get("/", (req, res) => bookingController.getMyBookings(req as AuthRequest, res));

router.post("/", verifyCsrfToken, (req, res) =>
  bookingController.createBooking(req as AuthRequest, res)
);

router.patch("/:id/cancel", verifyCsrfToken, (req, res) =>
  bookingController.cancelBooking(req as AuthRequest, res)
);

export default router;
