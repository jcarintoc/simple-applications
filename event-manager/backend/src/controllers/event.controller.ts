import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { eventService } from "../services/index.js";
import type { EventTag } from "../types/index.js";

const VALID_TAGS: EventTag[] = ["work", "personal", "urgent"];
const VALID_FILTERS = ["today", "week", "all"] as const;

export class EventController {
  getEvents(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const { search, filter, page, limit } = req.query;

    // Validate filter
    const filterValue = filter as string | undefined;
    if (filterValue && !VALID_FILTERS.includes(filterValue as typeof VALID_FILTERS[number])) {
      res.status(400).json({ error: "Invalid filter value" });
      return;
    }

    const events = eventService.getEvents(userId, {
      search: search as string | undefined,
      filter: filterValue as "today" | "week" | "all" | undefined,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 10,
    });

    res.json(events);
  }

  getEvent(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const eventId = parseInt(req.params.id, 10);

    if (isNaN(eventId)) {
      res.status(400).json({ error: "Invalid event ID" });
      return;
    }

    const event = eventService.getEventById(eventId, userId);

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    res.json({ event });
  }

  createEvent(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const { title, date, time, description, tag } = req.body;

    // Validation
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      res.status(400).json({ error: "Title is required" });
      return;
    }

    if (!date || typeof date !== "string") {
      res.status(400).json({ error: "Date is required" });
      return;
    }

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
      return;
    }

    if (!time || typeof time !== "string") {
      res.status(400).json({ error: "Time is required" });
      return;
    }

    // Validate time format (HH:MM)
    if (!/^\d{2}:\d{2}$/.test(time)) {
      res.status(400).json({ error: "Invalid time format. Use HH:MM" });
      return;
    }

    if (!tag || !VALID_TAGS.includes(tag as EventTag)) {
      res.status(400).json({ error: "Tag must be one of: work, personal, urgent" });
      return;
    }

    try {
      const event = eventService.createEvent(userId, {
        title: title.trim(),
        date,
        time,
        description: description?.trim() || undefined,
        tag: tag as EventTag,
      });

      res.status(201).json({ message: "Event created successfully", event });
    } catch (error) {
      console.error("Create event error:", error);
      res.status(500).json({ error: "Failed to create event" });
    }
  }

  updateEvent(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const eventId = parseInt(req.params.id, 10);

    if (isNaN(eventId)) {
      res.status(400).json({ error: "Invalid event ID" });
      return;
    }

    const { title, date, time, description, tag } = req.body;

    // Validate date format if provided
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
      return;
    }

    // Validate time format if provided
    if (time && !/^\d{2}:\d{2}$/.test(time)) {
      res.status(400).json({ error: "Invalid time format. Use HH:MM" });
      return;
    }

    // Validate tag if provided
    if (tag && !VALID_TAGS.includes(tag as EventTag)) {
      res.status(400).json({ error: "Tag must be one of: work, personal, urgent" });
      return;
    }

    try {
      const event = eventService.updateEvent(eventId, userId, {
        title: title?.trim(),
        date,
        time,
        description: description !== undefined ? description?.trim() || "" : undefined,
        tag: tag as EventTag | undefined,
      });

      if (!event) {
        res.status(404).json({ error: "Event not found" });
        return;
      }

      res.json({ message: "Event updated successfully", event });
    } catch (error) {
      console.error("Update event error:", error);
      res.status(500).json({ error: "Failed to update event" });
    }
  }

  deleteEvent(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const eventId = parseInt(req.params.id, 10);

    if (isNaN(eventId)) {
      res.status(400).json({ error: "Invalid event ID" });
      return;
    }

    // CSRF protection: require custom header
    const csrfHeader = req.headers["x-csrf-protection"];
    if (csrfHeader !== "1") {
      res.status(403).json({ error: "CSRF protection header required" });
      return;
    }

    try {
      const deleted = eventService.deleteEvent(eventId, userId);

      if (!deleted) {
        res.status(404).json({ error: "Event not found" });
        return;
      }

      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Delete event error:", error);
      res.status(500).json({ error: "Failed to delete event" });
    }
  }
}

export const eventController = new EventController();
