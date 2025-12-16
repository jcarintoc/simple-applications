import db from "../db/database.js";
import type { Product, ProductResponse, Review, ProductFilters } from "../types/index.js";

export class ProductRepository {
  findAll(filters?: ProductFilters): Product[] {
    let query = "SELECT * FROM products WHERE 1=1";
    const params: unknown[] = [];

    if (filters?.category) {
      query += " AND category = ?";
      params.push(filters.category);
    }

    if (filters?.search) {
      query += " AND (name LIKE ? OR description LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += " ORDER BY created_at DESC";

    return db.prepare(query).all(...params) as Product[];
  }

  findById(id: number): Product | undefined {
    return db.prepare("SELECT * FROM products WHERE id = ?").get(id) as Product | undefined;
  }

  findByIdWithStats(id: number): ProductResponse | undefined {
    const product = this.findById(id);
    if (!product) return undefined;

    const stats = db
      .prepare(
        `
      SELECT 
        AVG(rating) as average_rating,
        COUNT(*) as review_count
      FROM reviews
      WHERE product_id = ?
    `
      )
      .get(id) as { average_rating: number | null; review_count: number };

    return {
      ...product,
      average_rating: stats.average_rating ? Number(stats.average_rating.toFixed(1)) : undefined,
      review_count: stats.review_count,
    };
  }

  getReviewsByProductId(productId: number): Review[] {
    return db
      .prepare("SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC")
      .all(productId) as Review[];
  }

  getCategories(): string[] {
    const result = db.prepare("SELECT DISTINCT category FROM products ORDER BY category").all() as Array<{ category: string }>;
    return result.map((row) => row.category);
  }
}

export const productRepository = new ProductRepository();