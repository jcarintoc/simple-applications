import { Router } from "express";
import { eventController } from "../controllers/index.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/events - Get all events with filters and pagination
router.get("/", (req, res) => eventController.getEvents(req, res));

// GET /api/events/:id - Get single event
router.get("/:id", (req, res) => eventController.getEvent(req, res));

// POST /api/events - Create new event
router.post("/", (req, res) => eventController.createEvent(req, res));

// PUT /api/events/:id - Update event
router.put("/:id", (req, res) => eventController.updateEvent(req, res));

// DELETE /api/events/:id - Delete event (CSRF protected)
router.delete("/:id", (req, res) => eventController.deleteEvent(req, res));

export default router;
