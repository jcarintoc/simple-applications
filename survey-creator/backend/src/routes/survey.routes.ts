import { Router } from "express";
import { surveyController } from "../controllers/index.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware.js";
import { csrfMiddleware, type CSRFRequest } from "../middleware/csrf.middleware.js";

const router = Router();

// Public routes
router.get("/", (req, res) => surveyController.getAll(req, res));
router.get("/:id", (req, res) => surveyController.getById(req, res));
router.get("/:id/results", (req, res) => surveyController.getResults(req, res));

// Protected routes (require auth)
router.get("/user/my-surveys", authMiddleware, (req, res) => 
  surveyController.getMySurveys(req as CSRFRequest, res)
);

// Protected routes (require auth + CSRF)
router.post("/", authMiddleware, csrfMiddleware, (req, res) => 
  surveyController.create(req as CSRFRequest, res)
);
router.post("/:id/respond", authMiddleware, csrfMiddleware, (req, res) => 
  surveyController.submitResponse(req as CSRFRequest, res)
);
router.delete("/:id", authMiddleware, csrfMiddleware, (req, res) => 
  surveyController.delete(req as CSRFRequest, res)
);

export default router;

