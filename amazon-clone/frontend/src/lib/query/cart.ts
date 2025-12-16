import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartApi, type AddToCartInput, type UpdateCartItemInput } from "../api";
import { productKeys } from "./products";

export const cartKeys = {
  all: ["cart"] as const,
  items: () => [...cartKeys.all, "items"] as const,
};

export function useCart() {
  return useQuery({
    queryKey: cartKeys.items(),
    queryFn: () => cartApi.getCart(),
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartInput) => cartApi.addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.items() });
      // Invalidate product queries to update stock info
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCartItemInput }) =>
      cartApi.updateCartItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.items() });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cartApi.removeCartItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.items() });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.items() });
    },
  });
}