import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { passwordApi } from "../api";
import type { GeneratePasswordInput, SavePasswordInput } from "../api/types";

export const passwordKeys = {
  all: ["passwords"] as const,
  saved: () => [...passwordKeys.all, "saved"] as const,
};

export function useSavedPasswords() {
  return useQuery({
    queryKey: passwordKeys.saved(),
    queryFn: passwordApi.getSavedPasswords,
    retry: false,
  });
}

export function useGeneratePassword() {
  return useMutation({
    mutationFn: (data: GeneratePasswordInput) => passwordApi.generatePassword(data),
  });
}

export function useSavePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SavePasswordInput) => passwordApi.savePassword(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: passwordKeys.saved() });
    },
  });
}

export function useDeletePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => passwordApi.deletePassword(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: passwordKeys.saved() });
    },
  });
}

export function useDeleteAllPasswords() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => passwordApi.deleteAllPasswords(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: passwordKeys.saved() });
    },
  });
}

