import { cartRepository } from "../repositories/cart.repository.js";
import { productRepository } from "../repositories/product.repository.js";
import type { CartItemWithProduct, AddToCartDto, UpdateCartItemDto } from "../types/index.js";

export class CartService {
  getCart(sessionId?: string, userId?: number): CartItemWithProduct[] {
    return cartRepository.findWithProducts(sessionId, userId);
  }

  addToCart(
    data: AddToCartDto,
    sessionId?: string,
    userId?: number
  ): CartItemWithProduct {
    // Check if product exists
    const product = productRepository.findById(data.product_id);
    if (!product) {
      throw new Error("Product not found");
    }

    // Check if product is in stock
    if (product.stock < data.quantity) {
      throw new Error("Insufficient stock");
    }

    // Check if item already exists in cart
    const existingItem = cartRepository.findBySessionOrUserAndProduct(
      data.product_id,
      sessionId,
      userId
    );

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + data.quantity;
      if (product.stock < newQuantity) {
        throw new Error("Insufficient stock");
      }
      cartRepository.updateQuantity(existingItem.id, newQuantity);
      const updatedItem = cartRepository.findById(existingItem.id)!;
      const productResponse = productRepository.findByIdWithStats(data.product_id)!;
      return {
        ...updatedItem,
        product: productResponse,
      };
    }

    // Create new cart item
    const cartItemId = cartRepository.create({
      sessionId,
      userId,
      productId: data.product_id,
      quantity: data.quantity,
    });

    const cartItem = cartRepository.findById(cartItemId)!;
    const productResponse = productRepository.findByIdWithStats(data.product_id)!;
    return {
      ...cartItem,
      product: productResponse,
    };
  }

  updateCartItem(
    id: number,
    data: UpdateCartItemDto,
    sessionId?: string,
    userId?: number
  ): CartItemWithProduct {
    const cartItem = cartRepository.findById(id);
    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    // Verify ownership
    if (userId && cartItem.user_id !== userId) {
      throw new Error("Unauthorized");
    }
    if (!userId && cartItem.session_id !== sessionId) {
      throw new Error("Unauthorized");
    }

    // Check product stock
    const product = productRepository.findById(cartItem.product_id);
    if (!product) {
      throw new Error("Product not found");
    }

    if (product.stock < data.quantity) {
      throw new Error("Insufficient stock");
    }

    cartRepository.updateQuantity(id, data.quantity);
    const updatedItem = cartRepository.findById(id)!;
    const productResponse = productRepository.findByIdWithStats(cartItem.product_id)!;
    return {
      ...updatedItem,
      product: productResponse,
    };
  }

  removeCartItem(id: number, sessionId?: string, userId?: number): void {
    const cartItem = cartRepository.findById(id);
    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    // Verify ownership
    if (userId && cartItem.user_id !== userId) {
      throw new Error("Unauthorized");
    }
    if (!userId && cartItem.session_id !== sessionId) {
      throw new Error("Unauthorized");
    }

    cartRepository.delete(id);
  }

  clearCart(sessionId?: string, userId?: number): void {
    cartRepository.clear(sessionId, userId);
  }

  migrateCart(sessionId: string, userId: number): void {
    cartRepository.migrateSessionToUser(sessionId, userId);
  }
}

export const cartService = new CartService();