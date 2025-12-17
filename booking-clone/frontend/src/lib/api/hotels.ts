import { apiClient } from "./client";
import {
  hotelSearchResponseSchema,
  hotelDetailResponseSchema,
  featuredHotelsResponseSchema,
  type HotelSearchResponse,
  type HotelDetailResponse,
  type FeaturedHotelsResponse,
} from "./types";

export interface HotelSearchParams {
  location?: string;
  city?: string;
  country?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export const hotelsApi = {
  search: async (params: HotelSearchParams): Promise<HotelSearchResponse> => {
    const response = await apiClient.get("/hotels", { params });
    return hotelSearchResponseSchema.parse(response.data);
  },

  getById: async (id: number): Promise<HotelDetailResponse> => {
    const response = await apiClient.get(`/hotels/${id}`);
    return hotelDetailResponseSchema.parse(response.data);
  },

  getFeatured: async (): Promise<FeaturedHotelsResponse> => {
    const response = await apiClient.get("/hotels/featured");
    return featuredHotelsResponseSchema.parse(response.data);
  },
};
