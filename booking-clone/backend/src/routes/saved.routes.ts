import { Router } from "express";
import { savedController } from "../controllers/index.js";
import {
  authMiddleware,
  type AuthRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/toggle", (req, res) =>
  savedController.toggle(req as AuthRequest, res)
);
router.get("/", (req, res) =>
  savedController.getUserSaved(req as AuthRequest, res)
);
router.get("/check/:hotelId", (req, res) =>
  savedController.checkSaved(req as AuthRequest, res)
);

export default router;
