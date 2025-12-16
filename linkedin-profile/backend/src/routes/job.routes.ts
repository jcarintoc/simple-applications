import { Router } from "express";
import { jobController } from "../controllers/job.controller.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";

const router = Router();

router.get("/", authMiddleware, (req, res) => jobController.getJobs(req as AuthRequest, res));
router.get("/applications/my", authMiddleware, (req, res) => jobController.getMyApplications(req as AuthRequest, res));
router.get("/:id", authMiddleware, (req, res) => jobController.getJobById(req, res));
router.post("/:id/apply", authMiddleware, verifyCsrfToken, (req, res) => jobController.applyToJob(req as AuthRequest, res));

export default router;
