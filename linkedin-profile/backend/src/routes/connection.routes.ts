import { Router } from "express";
import { connectionController } from "../controllers/connection.controller.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";

const router = Router();

router.get("/", authMiddleware, (req, res) => connectionController.getConnections(req as AuthRequest, res));
router.get("/pending", authMiddleware, (req, res) => connectionController.getPendingRequests(req as AuthRequest, res));
router.get("/sent", authMiddleware, (req, res) => connectionController.getSentRequests(req as AuthRequest, res));
router.get("/status/:userId", authMiddleware, (req, res) => connectionController.getConnectionStatus(req, res));
router.post("/request", authMiddleware, verifyCsrfToken, (req, res) => connectionController.sendRequest(req as AuthRequest, res));
router.put("/:id/accept", authMiddleware, verifyCsrfToken, (req, res) => connectionController.acceptConnection(req, res));
router.put("/:id/reject", authMiddleware, verifyCsrfToken, (req, res) => connectionController.rejectConnection(req, res));
router.delete("/:id", authMiddleware, verifyCsrfToken, (req, res) => connectionController.removeConnection(req, res));

export default router;
