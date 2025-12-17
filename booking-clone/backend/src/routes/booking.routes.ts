import { Router } from "express";
import { bookingController } from "../controllers/index.js";
import {
  authMiddleware,
  type AuthRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", (req, res) =>
  bookingController.create(req as AuthRequest, res)
);
router.get("/", (req, res) =>
  bookingController.getUserBookings(req as AuthRequest, res)
);
router.delete("/:id", (req, res) =>
  bookingController.cancel(req as AuthRequest, res)
);

export default router;
