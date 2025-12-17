import type { Request, Response } from "express";
import { hotelService } from "../services/index.js";

export class HotelController {
  search(req: Request, res: Response): void {
    const params = {
      location: req.query.location as string | undefined,
      city: req.query.city as string | undefined,
      country: req.query.country as string | undefined,
      checkIn: req.query.checkIn as string | undefined,
      checkOut: req.query.checkOut as string | undefined,
      guests: req.query.guests ? parseInt(req.query.guests as string) : undefined,
      minPrice: req.query.minPrice
        ? parseFloat(req.query.minPrice as string)
        : undefined,
      maxPrice: req.query.maxPrice
        ? parseFloat(req.query.maxPrice as string)
        : undefined,
      minRating: req.query.minRating
        ? parseFloat(req.query.minRating as string)
        : undefined,
      sortBy: req.query.sortBy as string | undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    };

    const result = hotelService.search(params);
    res.json(result);
  }

  getById(req: Request, res: Response): void {
    const id = parseInt(req.params.id);
    const hotel = hotelService.getById(id);

    if (!hotel) {
      res.status(404).json({ error: "Hotel not found" });
      return;
    }

    res.json({ hotel });
  }

  getFeatured(_req: Request, res: Response): void {
    const hotels = hotelService.getFeatured();
    res.json({ hotels });
  }
}

export const hotelController = new HotelController();
