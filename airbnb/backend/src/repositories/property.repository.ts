import db from "../db/database.js";
import type { Property, PropertyWithOwner, CreatePropertyDto, UpdatePropertyDto } from "../types/index.js";

export class PropertyRepository {
  findAll(filters?: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    maxGuests?: number;
  }): PropertyWithOwner[] {
    let query = `
      SELECT 
        p.*,
        u.name as owner_name,
        u.email as owner_email
      FROM properties p
      JOIN users u ON p.owner_id = u.id
      WHERE 1=1
    `;
    const params: unknown[] = [];

    if (filters?.location) {
      query += ` AND p.location LIKE ?`;
      params.push(`%${filters.location}%`);
    }

    if (filters?.minPrice !== undefined) {
      query += ` AND p.price_per_night >= ?`;
      params.push(filters.minPrice);
    }

    if (filters?.maxPrice !== undefined) {
      query += ` AND p.price_per_night <= ?`;
      params.push(filters.maxPrice);
    }

    if (filters?.maxGuests !== undefined) {
      query += ` AND p.max_guests >= ?`;
      params.push(filters.maxGuests);
    }

    query += ` ORDER BY p.created_at DESC`;

    return db.prepare(query).all(...params) as PropertyWithOwner[];
  }

  findById(id: number): PropertyWithOwner | undefined {
    return db.prepare(`
      SELECT 
        p.*,
        u.name as owner_name,
        u.email as owner_email
      FROM properties p
      JOIN users u ON p.owner_id = u.id
      WHERE p.id = ?
    `).get(id) as PropertyWithOwner | undefined;
  }

  findByOwner(ownerId: number): PropertyWithOwner[] {
    return db.prepare(`
      SELECT 
        p.*,
        u.name as owner_name,
        u.email as owner_email
      FROM properties p
      JOIN users u ON p.owner_id = u.id
      WHERE p.owner_id = ?
      ORDER BY p.created_at DESC
    `).all(ownerId) as PropertyWithOwner[];
  }

  create(ownerId: number, data: CreatePropertyDto): number {
    const result = db.prepare(`
      INSERT INTO properties (
        owner_id, title, description, location, price_per_night,
        max_guests, bedrooms, bathrooms, amenities, image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      ownerId,
      data.title,
      data.description,
      data.location,
      data.price_per_night,
      data.max_guests,
      data.bedrooms,
      data.bathrooms,
      data.amenities ? JSON.stringify(data.amenities) : null,
      data.image_url || null
    );
    return result.lastInsertRowid as number;
  }

  update(id: number, data: UpdatePropertyDto): boolean {
    const updates: string[] = [];
    const params: unknown[] = [];

    if (data.title !== undefined) {
      updates.push("title = ?");
      params.push(data.title);
    }
    if (data.description !== undefined) {
      updates.push("description = ?");
      params.push(data.description);
    }
    if (data.location !== undefined) {
      updates.push("location = ?");
      params.push(data.location);
    }
    if (data.price_per_night !== undefined) {
      updates.push("price_per_night = ?");
      params.push(data.price_per_night);
    }
    if (data.max_guests !== undefined) {
      updates.push("max_guests = ?");
      params.push(data.max_guests);
    }
    if (data.bedrooms !== undefined) {
      updates.push("bedrooms = ?");
      params.push(data.bedrooms);
    }
    if (data.bathrooms !== undefined) {
      updates.push("bathrooms = ?");
      params.push(data.bathrooms);
    }
    if (data.amenities !== undefined) {
      updates.push("amenities = ?");
      params.push(data.amenities ? JSON.stringify(data.amenities) : null);
    }
    if (data.image_url !== undefined) {
      updates.push("image_url = ?");
      params.push(data.image_url || null);
    }

    if (updates.length === 0) {
      return false;
    }

    params.push(id);
    const result = db.prepare(`UPDATE properties SET ${updates.join(", ")} WHERE id = ?`).run(...params);
    return result.changes > 0;
  }

  delete(id: number): boolean {
    const result = db.prepare("DELETE FROM properties WHERE id = ?").run(id);
    return result.changes > 0;
  }
}

export const propertyRepository = new PropertyRepository();
