import { Router } from "express";
import { csrfController } from "../controllers/index.js";
import {
  authMiddleware,
  type AuthRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get("/token", authMiddleware, (req, res) =>
  csrfController.getToken(req as AuthRequest, res)
);

export default router;
