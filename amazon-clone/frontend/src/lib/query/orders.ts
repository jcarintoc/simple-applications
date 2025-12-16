import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "../api";
import { cartKeys } from "./cart";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: number) => [...orderKeys.details(), id] as const,
};

export function useOrders() {
  return useQuery({
    queryKey: orderKeys.lists(),
    queryFn: () => ordersApi.getOrders(),
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => ordersApi.getOrderById(id),
    enabled: !!id,
  });
}

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => ordersApi.checkout(),
    onSuccess: () => {
      // Invalidate cart and orders after successful checkout
      queryClient.invalidateQueries({ queryKey: cartKeys.items() });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}