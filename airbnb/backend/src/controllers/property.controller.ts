import type { Request, Response } from "express";
import { propertyService } from "../services/property.service.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import type { CreatePropertyDto, UpdatePropertyDto } from "../types/index.js";

export class PropertyController {
  getProperties(req: Request, res: Response): void {
    const location = req.query.location as string | undefined;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
    const maxGuests = req.query.maxGuests ? parseInt(req.query.maxGuests as string, 10) : undefined;

    try {
      const properties = propertyService.getProperties({
        location,
        minPrice,
        maxPrice,
        maxGuests,
      });
      res.json({ properties });
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  }

  getPropertyById(req: Request, res: Response): void {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid property ID" });
      return;
    }

    try {
      const property = propertyService.getPropertyById(id);
      if (!property) {
        res.status(404).json({ error: "Property not found" });
        return;
      }
      res.json({ property });
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ error: "Failed to fetch property" });
    }
  }

  getMyProperties(req: AuthRequest, res: Response): void {
    const userId = req.userId!;

    try {
      const properties = propertyService.getPropertiesByOwner(userId);
      res.json({ properties });
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  }

  createProperty(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const data: CreatePropertyDto = req.body;

    if (!data.title || !data.description || !data.location || !data.price_per_night) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    try {
      const property = propertyService.createProperty(userId, data);
      res.status(201).json({ property });
    } catch (error) {
      console.error("Error creating property:", error);
      res.status(500).json({ error: "Failed to create property" });
    }
  }

  updateProperty(req: AuthRequest, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const userId = req.userId!;
    const data: UpdatePropertyDto = req.body;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid property ID" });
      return;
    }

    try {
      const success = propertyService.updateProperty(id, userId, data);
      if (!success) {
        res.status(404).json({ error: "Property not found or unauthorized" });
        return;
      }
      const property = propertyService.getPropertyById(id);
      res.json({ property });
    } catch (error) {
      console.error("Error updating property:", error);
      res.status(500).json({ error: "Failed to update property" });
    }
  }

  deleteProperty(req: AuthRequest, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const userId = req.userId!;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid property ID" });
      return;
    }

    try {
      const success = propertyService.deleteProperty(id, userId);
      if (!success) {
        res.status(404).json({ error: "Property not found or unauthorized" });
        return;
      }
      res.json({ message: "Property deleted successfully" });
    } catch (error) {
      console.error("Error deleting property:", error);
      res.status(500).json({ error: "Failed to delete property" });
    }
  }
}

export const propertyController = new PropertyController();
