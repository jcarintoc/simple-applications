import db from "../db/database.js";
import type { Order, OrderItem, OrderWithItems, ProductResponse } from "../types/index.js";

export class OrderRepository {
  create(userId: number, total: number): number {
    const result = db
      .prepare("INSERT INTO orders (user_id, total, status) VALUES (?, ?, 'pending')")
      .run(userId, total);
    
    return result.lastInsertRowid as number;
  }

  createOrderItem(orderId: number, productId: number, quantity: number, price: number): number {
    const result = db
      .prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)")
      .run(orderId, productId, quantity, price);
    
    return result.lastInsertRowid as number;
  }

  findByUserId(userId: number): Order[] {
    return db
      .prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC")
      .all(userId) as Order[];
  }

  findById(id: number): Order | undefined {
    return db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as Order | undefined;
  }

  findOrderItemsByOrderId(orderId: number): Array<OrderItem & { product: ProductResponse }> {
    const items = db
      .prepare("SELECT * FROM order_items WHERE order_id = ?")
      .all(orderId) as OrderItem[];

    return items.map((item) => {
      const product = db
        .prepare(
          "SELECT id, name, description, price, image_url, category, stock, created_at FROM products WHERE id = ?"
        )
        .get(item.product_id) as ProductResponse;

      return {
        ...item,
        product,
      };
    });
  }

  findByIdWithItems(id: number, userId: number): OrderWithItems | undefined {
    const order = this.findById(id);
    if (!order || order.user_id !== userId) {
      return undefined;
    }

    const items = this.findOrderItemsByOrderId(id);
    return {
      ...order,
      items,
    };
  }

  findByUserIdWithItems(userId: number): OrderWithItems[] {
    const orders = this.findByUserId(userId);
    return orders.map((order) => {
      const items = this.findOrderItemsByOrderId(order.id);
      return {
        ...order,
        items,
      };
    });
  }
}

export const orderRepository = new OrderRepository();