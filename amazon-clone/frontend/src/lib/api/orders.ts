import { apiClient } from "./client";
import {
  type Order,
  ordersResponseSchema,
  orderResponseSchema,
} from "./types";

export const ordersApi = {
  checkout: async (): Promise<Order> => {
    const response = await apiClient.post("/orders/checkout");
    return orderResponseSchema.parse(response.data).order;
  },

  getOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get("/orders");
    return ordersResponseSchema.parse(response.data).orders;
  },

  getOrderById: async (id: number): Promise<Order> => {
    const response = await apiClient.get(`/orders/${id}`);
    return orderResponseSchema.parse(response.data).order;
  },
};