import { apiClient } from "./client";
import {
  type CartItem,
  type AddToCartInput,
  type UpdateCartItemInput,
  cartResponseSchema,
  cartItemResponseSchema,
  addToCartInputSchema,
  updateCartItemInputSchema,
} from "./types";

export const cartApi = {
  getCart: async (): Promise<CartItem[]> => {
    const response = await apiClient.get("/cart");
    return cartResponseSchema.parse(response.data).items;
  },

  addToCart: async (data: AddToCartInput): Promise<CartItem> => {
    const validatedData = addToCartInputSchema.parse(data);
    const response = await apiClient.post("/cart", validatedData);
    return cartItemResponseSchema.parse(response.data).item;
  },

  updateCartItem: async (id: number, data: UpdateCartItemInput): Promise<CartItem> => {
    const validatedData = updateCartItemInputSchema.parse(data);
    const response = await apiClient.put(`/cart/${id}`, validatedData);
    return cartItemResponseSchema.parse(response.data).item;
  },

  removeCartItem: async (id: number): Promise<void> => {
    await apiClient.delete(`/cart/${id}`);
  },

  clearCart: async (): Promise<void> => {
    await apiClient.delete("/cart");
  },
};