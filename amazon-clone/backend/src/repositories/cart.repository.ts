import db from "../db/database.js";
import type { CartItem, CartItemWithProduct, ProductResponse } from "../types/index.js";

export class CartRepository {
  findBySessionOrUser(sessionId?: string, userId?: number): CartItem[] {
    if (userId) {
      return db
        .prepare("SELECT * FROM cart_items WHERE user_id = ? ORDER BY created_at DESC")
        .all(userId) as CartItem[];
    }
    
    if (sessionId) {
      return db
        .prepare("SELECT * FROM cart_items WHERE session_id = ? ORDER BY created_at DESC")
        .all(sessionId) as CartItem[];
    }

    return [];
  }

  findById(id: number): CartItem | undefined {
    return db.prepare("SELECT * FROM cart_items WHERE id = ?").get(id) as CartItem | undefined;
  }

  findBySessionOrUserAndProduct(
    productId: number,
    sessionId?: string,
    userId?: number
  ): CartItem | undefined {
    if (userId) {
      return db
        .prepare("SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?")
        .get(userId, productId) as CartItem | undefined;
    }
    
    if (sessionId) {
      return db
        .prepare("SELECT * FROM cart_items WHERE session_id = ? AND product_id = ?")
        .get(sessionId, productId) as CartItem | undefined;
    }

    return undefined;
  }

  create(data: {
    sessionId?: string;
    userId?: number;
    productId: number;
    quantity: number;
  }): number {
    const result = db
      .prepare(
        "INSERT INTO cart_items (session_id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)"
      )
      .run(data.sessionId || null, data.userId || null, data.productId, data.quantity);
    
    return result.lastInsertRowid as number;
  }

  updateQuantity(id: number, quantity: number): boolean {
    const result = db
      .prepare("UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .run(quantity, id);
    
    return result.changes > 0;
  }

  delete(id: number): boolean {
    const result = db.prepare("DELETE FROM cart_items WHERE id = ?").run(id);
    return result.changes > 0;
  }

  clear(sessionId?: string, userId?: number): void {
    if (userId) {
      db.prepare("DELETE FROM cart_items WHERE user_id = ?").run(userId);
    } else if (sessionId) {
      db.prepare("DELETE FROM cart_items WHERE session_id = ?").run(sessionId);
    }
  }

  migrateSessionToUser(sessionId: string, userId: number): void {
    // Update existing cart items from session to user
    db.prepare("UPDATE cart_items SET session_id = NULL, user_id = ? WHERE session_id = ?").run(
      userId,
      sessionId
    );
  }

  // Get cart items with product details
  findWithProducts(sessionId?: string, userId?: number): CartItemWithProduct[] {
    const items = this.findBySessionOrUser(sessionId, userId);
    
    // Fetch product details for each item
    return items.map((item) => {
      const product = db
        .prepare("SELECT id, name, description, price, image_url, category, stock, created_at FROM products WHERE id = ?")
        .get(item.product_id) as ProductResponse;
      
      return {
        ...item,
        product,
      };
    });
  }
}

export const cartRepository = new CartRepository();