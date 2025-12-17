import db from "../db/database.js";
import type { Hotel, HotelSearchParams } from "../types/index.js";

export class HotelRepository {
  findById(id: number): Hotel | undefined {
    return db.prepare("SELECT * FROM hotels WHERE id = ?").get(id) as
      | Hotel
      | undefined;
  }

  search(params: HotelSearchParams): { hotels: Hotel[]; total: number } {
    const conditions: string[] = [];
    const values: (string | number)[] = [];

    // General location search - searches across city, country, location, and name
    if (params.location) {
      conditions.push("(city LIKE ? OR country LIKE ? OR location LIKE ? OR name LIKE ?)");
      const searchTerm = `%${params.location}%`;
      values.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    if (params.city) {
      conditions.push("city LIKE ?");
      values.push(`%${params.city}%`);
    }
    if (params.country) {
      conditions.push("country LIKE ?");
      values.push(`%${params.country}%`);
    }
    if (params.minPrice !== undefined) {
      conditions.push("price_per_night >= ?");
      values.push(params.minPrice);
    }
    if (params.maxPrice !== undefined) {
      conditions.push("price_per_night <= ?");
      values.push(params.maxPrice);
    }
    if (params.minRating !== undefined) {
      conditions.push("rating >= ?");
      values.push(params.minRating);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;

    // Dynamic sorting based on sortBy parameter
    let orderClause = "ORDER BY rating DESC"; // default
    if (params.sortBy === "price_asc") {
      orderClause = "ORDER BY price_per_night ASC";
    } else if (params.sortBy === "price_desc") {
      orderClause = "ORDER BY price_per_night DESC";
    } else if (params.sortBy === "rating") {
      orderClause = "ORDER BY rating DESC";
    }

    const countQuery = `SELECT COUNT(*) as total FROM hotels ${whereClause}`;
    const dataQuery = `SELECT * FROM hotels ${whereClause} ${orderClause} LIMIT ? OFFSET ?`;

    const total = (
      db.prepare(countQuery).get(...values) as { total: number }
    ).total;
    const hotels = db
      .prepare(dataQuery)
      .all(...values, limit, offset) as Hotel[];

    return { hotels, total };
  }

  getFeatured(limit: number = 6): Hotel[] {
    return db
      .prepare(
        "SELECT * FROM hotels ORDER BY rating DESC, review_count DESC LIMIT ?"
      )
      .all(limit) as Hotel[];
  }

  updateRating(hotelId: number, rating: number, reviewCount: number): void {
    db.prepare(
      "UPDATE hotels SET rating = ?, review_count = ? WHERE id = ?"
    ).run(rating, reviewCount, hotelId);
  }

  create(hotel: Omit<Hotel, "id" | "rating" | "review_count" | "created_at">): number {
    const result = db
      .prepare(
        `INSERT INTO hotels (name, description, location, city, country, address, price_per_night, amenities, images, rooms_available)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        hotel.name,
        hotel.description,
        hotel.location,
        hotel.city,
        hotel.country,
        hotel.address,
        hotel.price_per_night,
        hotel.amenities,
        hotel.images,
        hotel.rooms_available
      );
    return result.lastInsertRowid as number;
  }
}

export const hotelRepository = new HotelRepository();
