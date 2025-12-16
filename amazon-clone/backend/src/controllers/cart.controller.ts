import type { Request, Response } from "express";
import { cartService } from "../services/cart.service.js";
import type { SessionRequest } from "../middleware/session.middleware.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

type CartRequest = SessionRequest & AuthRequest;

export class CartController {
  getCart(req: CartRequest, res: Response): void {
    try {
      const sessionId = req.sessionId;
      const userId = req.userId;

      const items = cartService.getCart(sessionId, userId);
      res.json({ items });
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  }

  addToCart(req: CartRequest, res: Response): void {
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity || quantity < 1) {
      res.status(400).json({ error: "product_id and quantity (>= 1) are required" });
      return;
    }

    try {
      const sessionId = req.sessionId;
      const userId = req.userId;

      const item = cartService.addToCart(
        { product_id, quantity },
        sessionId,
        userId
      );
      res.status(201).json({ item });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add to cart";
      const status = message === "Product not found" ? 404 : message.includes("stock") ? 400 : 500;
      res.status(status).json({ error: message });
    }
  }

  updateCartItem(req: CartRequest, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const { quantity } = req.body;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid cart item ID" });
      return;
    }

    if (!quantity || quantity < 1) {
      res.status(400).json({ error: "quantity (>= 1) is required" });
      return;
    }

    try {
      const sessionId = req.sessionId;
      const userId = req.userId;

      const item = cartService.updateCartItem(id, { quantity }, sessionId, userId);
      res.json({ item });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update cart item";
      const status =
        message === "Cart item not found" || message === "Unauthorized"
          ? 404
          : message.includes("stock")
            ? 400
            : 500;
      res.status(status).json({ error: message });
    }
  }

  removeCartItem(req: CartRequest, res: Response): void {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid cart item ID" });
      return;
    }

    try {
      const sessionId = req.sessionId;
      const userId = req.userId;

      cartService.removeCartItem(id, sessionId, userId);
      res.json({ message: "Cart item removed" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to remove cart item";
      const status = message === "Cart item not found" || message === "Unauthorized" ? 404 : 500;
      res.status(status).json({ error: message });
    }
  }

  clearCart(req: CartRequest, res: Response): void {
    try {
      const sessionId = req.sessionId;
      const userId = req.userId;

      cartService.clearCart(sessionId, userId);
      res.json({ message: "Cart cleared" });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ error: "Failed to clear cart" });
    }
  }
}

export const cartController = new CartController();