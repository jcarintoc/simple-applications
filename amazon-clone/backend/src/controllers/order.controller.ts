import type { Request, Response } from "express";
import { orderService } from "../services/order.service.js";
import { cartService } from "../services/cart.service.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import type { SessionRequest } from "../middleware/session.middleware.js";

type OrderRequest = AuthRequest & SessionRequest;

export class OrderController {
  checkout(req: OrderRequest, res: Response): void {
    const userId = req.userId!;
    const sessionId = req.sessionId;

    try {
      // Migrate session cart to user if exists
      if (sessionId) {
        cartService.migrateCart(sessionId, userId);
      }

      const order = orderService.checkout(userId, sessionId);
      res.status(201).json({ order });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to checkout";
      const status = message.includes("empty") || message.includes("stock") ? 400 : 500;
      res.status(status).json({ error: message });
    }
  }

  getOrders(req: OrderRequest, res: Response): void {
    const userId = req.userId!;

    try {
      const orders = orderService.getOrders(userId);
      res.json({ orders });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  }

  getOrderById(req: OrderRequest, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const userId = req.userId!;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid order ID" });
      return;
    }

    try {
      const order = orderService.getOrderById(id, userId);

      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }

      res.json({ order });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  }
}

export const orderController = new OrderController();