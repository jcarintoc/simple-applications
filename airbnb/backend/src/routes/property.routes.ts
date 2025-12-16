import { Router } from "express";
import { propertyController } from "../controllers/property.controller.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";
import reviewRoutes from "./review.routes.js";

const router = Router();

// Protected routes (before parameterized routes to avoid conflicts)
router.get("/owner/my-properties", authMiddleware, (req, res) =>
  propertyController.getMyProperties(req as AuthRequest, res)
);

// Public routes
router.get("/", (req, res) => propertyController.getProperties(req, res));

// Review routes (nested under properties, before :id route)
router.use("/:propertyId/reviews", reviewRoutes);

router.get("/:id", (req, res) => propertyController.getPropertyById(req, res));

router.post("/", authMiddleware, verifyCsrfToken, (req, res) =>
  propertyController.createProperty(req as AuthRequest, res)
);

router.put("/:id", authMiddleware, verifyCsrfToken, (req, res) =>
  propertyController.updateProperty(req as AuthRequest, res)
);

router.delete("/:id", authMiddleware, verifyCsrfToken, (req, res) =>
  propertyController.deleteProperty(req as AuthRequest, res)
);

export default router;
