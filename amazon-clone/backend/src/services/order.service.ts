import { orderRepository } from "../repositories/order.repository.js";
import { cartRepository } from "../repositories/cart.repository.js";
import { productRepository } from "../repositories/product.repository.js";
import db from "../db/database.js";
import type { OrderWithItems } from "../types/index.js";

export class OrderService {
  checkout(userId: number, sessionId?: string): OrderWithItems {
    // Get cart items
    const cartItems = cartRepository.findWithProducts(sessionId, userId);

    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    // Validate stock and calculate total
    let total = 0;
    const itemsToOrder: Array<{
      productId: number;
      quantity: number;
      price: number;
    }> = [];

    for (const item of cartItems) {
      const product = productRepository.findById(item.product_id);
      if (!product) {
        throw new Error(`Product ${item.product_id} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      itemsToOrder.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create order
    const orderId = orderRepository.create(userId, total);

    // Create order items
    for (const item of itemsToOrder) {
      orderRepository.createOrderItem(orderId, item.productId, item.quantity, item.price);

      // Update product stock
      const product = productRepository.findById(item.productId)!;
      const newStock = product.stock - item.quantity;
      db.prepare("UPDATE products SET stock = ? WHERE id = ?").run(newStock, item.productId);
    }

    // Clear cart
    cartRepository.clear(sessionId, userId);

    // Return order with items
    const order = orderRepository.findByIdWithItems(orderId, userId);
    if (!order) {
      throw new Error("Failed to create order");
    }

    return order;
  }

  getOrders(userId: number): OrderWithItems[] {
    return orderRepository.findByUserIdWithItems(userId);
  }

  getOrderById(id: number, userId: number): OrderWithItems | null {
    return orderRepository.findByIdWithItems(id, userId) || null;
  }
}

export const orderService = new OrderService();