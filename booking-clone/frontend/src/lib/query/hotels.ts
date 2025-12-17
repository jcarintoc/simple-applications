import { useQuery } from "@tanstack/react-query";
import { hotelsApi, type HotelSearchParams } from "../api";

export const hotelKeys = {
  all: ["hotels"] as const,
  search: (params: HotelSearchParams) =>
    [...hotelKeys.all, "search", params] as const,
  detail: (id: number) => [...hotelKeys.all, "detail", id] as const,
  featured: () => [...hotelKeys.all, "featured"] as const,
};

export function useHotelSearch(params: HotelSearchParams, enabled = true) {
  return useQuery({
    queryKey: hotelKeys.search(params),
    queryFn: () => hotelsApi.search(params),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

export function useHotel(id: number) {
  return useQuery({
    queryKey: hotelKeys.detail(id),
    queryFn: () => hotelsApi.getById(id),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedHotels() {
  return useQuery({
    queryKey: hotelKeys.featured(),
    queryFn: hotelsApi.getFeatured,
    staleTime: 10 * 60 * 1000,
  });
}
