import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { propertiesApi, type CreatePropertyInput, type UpdatePropertyInput, type PropertyFilters } from "../api";

export const propertyKeys = {
  all: ["properties"] as const,
  lists: () => [...propertyKeys.all, "list"] as const,
  list: (filters?: PropertyFilters) => [...propertyKeys.lists(), filters] as const,
  details: () => [...propertyKeys.all, "detail"] as const,
  detail: (id: number) => [...propertyKeys.details(), id] as const,
  myProperties: () => [...propertyKeys.all, "my-properties"] as const,
};

export function useProperties(filters?: PropertyFilters) {
  return useQuery({
    queryKey: propertyKeys.list(filters),
    queryFn: () => propertiesApi.getProperties(filters),
  });
}

export function useProperty(id: number) {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => propertiesApi.getPropertyById(id),
    enabled: !!id,
  });
}

export function useMyProperties() {
  return useQuery({
    queryKey: propertyKeys.myProperties(),
    queryFn: () => propertiesApi.getMyProperties(),
    staleTime: 0, // Always consider data stale to prevent 304 issues
    refetchOnMount: 'always', // Always refetch when component mounts
    retry: false, // Don't retry on error to see errors immediately
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePropertyInput) => propertiesApi.createProperty(data),
    onSuccess: () => {
      // Reset and invalidate queries to ensure fresh data
      queryClient.resetQueries({ queryKey: propertyKeys.myProperties() });
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists(), refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: propertyKeys.myProperties(), refetchType: 'active' });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePropertyInput }) =>
      propertiesApi.updateProperty(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(id), refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists(), refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: propertyKeys.myProperties(), refetchType: 'active' });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => propertiesApi.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: propertyKeys.myProperties() });
    },
  });
}
